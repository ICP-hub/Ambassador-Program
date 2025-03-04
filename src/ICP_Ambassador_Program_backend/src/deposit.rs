use candid::{CandidType, Deserialize, Nat, Principal};
use ic_cdk_macros::update;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::{BlockIndex, NumTokens};
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};
use serde::Serialize;
use crate::{CKUSDC_LEDGER_ID,BACKEND_CANISTER_WALLET_ID};

#[derive(CandidType, Deserialize, Debug)]
struct TransferArg {
    from_subaccount: Option<Vec<u8>>,
    to: Account,
    amount: Nat,
    fee: Option<u64>,
    memo: Option<Vec<u8>>,
    created_at_time: Option<u64>,
}

#[derive(CandidType, Deserialize)]
enum TransferResult {
    Ok(Nat),
    Err(String),
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct TransferArgs {
    amount: NumTokens,
    to_account: Account,
}

#[update]
pub async fn deposit_icp_to_canister(amount: u64) -> Result<BlockIndex, String> {
    ic_cdk::println!("Transferring {:?} tokens to Canister Wallet", amount);

    let transfer_from_args = TransferFromArgs {
        // the account we want to transfer tokens from (in this case we assume the caller approved the canister to spend funds on their behalf)
        from: Account::from(ic_cdk::caller()),
        // can be used to distinguish between transactions
        memo: None,
        // the amount we want to transfer
        amount: amount.into(),
        // the subaccount we want to spend the tokens from (in this case we assume the default subaccount has been approved)
        spender_subaccount: None,
        // if not specified, the default fee for the canister is used
        fee: None,
        // the account we want to transfer tokens to
        to: Account::from(Principal::from_text(BACKEND_CANISTER_WALLET_ID).unwrap()),
        // a timestamp indicating when the transaction was created by the caller; if it is not specified by the caller then this is set to the current ICP time
        created_at_time: None,
    };

    // 1. Asynchronously call another canister function using `ic_cdk::call`.
    ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
        // 2. Convert a textual representation of a Principal into an actual `Principal` object. The principal is the one we specified in `dfx.json`.
        //    `expect` will panic if the conversion fails, ensuring the code does not proceed with an invalid principal.

        Principal::from_text(CKUSDC_LEDGER_ID)
            .expect("Could not decode the principal."),
        // 3. Specify the method name on the target canister to be called, in this case, "icrc1_transfer".
        "icrc2_transfer_from",
        // 4. Provide the arguments for the call in a tuple, here `transfer_args` is encapsulated as a single-element tuple.
        (transfer_from_args,),
    )
    .await // 5. Await the completion of the asynchronous call, pausing the execution until the future is resolved.
    // 6. Apply `map_err` to transform any network or system errors encountered during the call into a more readable string format.
    //    The `?` operator is then used to propagate errors: if the result is an `Err`, it returns from the function with that error,
    //    otherwise, it unwraps the `Ok` value, allowing the chain to continue.
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    // 7. Access the first element of the tuple, which is the `Result<BlockIndex, TransferError>`, for further processing.
    .0
    // 8. Use `map_err` again to transform any specific ledger transfer errors into a readable string format, facilitating error handling and debugging.
    .map_err(|e| format!("ledger transfer error {:?}", e))
}
