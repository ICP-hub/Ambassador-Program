use candid::{encode_one, Nat, Principal};
use ic_cdk::api::{self, call::{CallResult, RejectionCode}, management_canister::main::{CanisterInstallMode, WasmModule}};
use icrc_ledger_types::icrc1::{account::Account, transfer::{TransferArg, TransferError,NumTokens}};
use crate::{icp_ledger_id, CreateFileInput, ImageIdWrapper, ProfileImageData, ReturnResult, IMAGE_MAP};


#[ic_cdk::update]
pub async fn upload_profile_image(asset_canister_id: String, image_data: ProfileImageData) -> Result<String, String> {
    // let principal = ic_cdk::api::caller();  // Get the caller's principal

    let input = CreateFileInput {
        name: "profile_image.png".to_string(),
        content_type: "image/png".to_string(),
        size: None,
        content: image_data.content.clone(),
        status: Some(1),
        hash: None,
        ert: None,
        crc32: None,
    };

    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        Principal::from_text(asset_canister_id.clone()).unwrap(),
        "create_file",
        (input,)
    ).await;

    match response {
        Ok((Ok(image_id),)) => {
            // Update IMAGE_MAP with the uploaded image ID
            // IMAGE_MAP.with(|image_map| {
            //     image_map.borrow_mut().insert(
            //         principal.to_string(),
            //         ImageIdWrapper { image_id: image_id.to_string() }  // Convert u32 to String
            //     );
            // });

            Ok(format!("{}", image_id))
        },
        Ok((Err(err),)) => Err(err),
        Err((code, message)) => match code {
            RejectionCode::NoError => Err("NoError".to_string()),
            RejectionCode::SysFatal => Err("SysFatal".to_string()),
            RejectionCode::SysTransient => Err("SysTransient".to_string()),
            RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
            RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
            _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
        }
    }
}

pub async fn transfer_amount(amount:u64,user:Principal,space_id:String)->Result<Nat,String>{
    let space_blob=space_id.as_bytes().try_into().unwrap();
    let tokens=NumTokens::from(amount);
    let transfer_args=TransferArg{
        to:Account{
            owner:user,
            subaccount:None
        },
        from_subaccount:Some(space_blob),
        fee:None,
        created_at_time:None,
        memo:None,
        amount:tokens.clone()
    };
    let ledger_canister_id = Principal::from_text(icp_ledger_id)
        .map_err(|_| "Invalid ledger canister ID".to_string())?;
    let (result,): (Result<Nat, String>,) = ic_cdk::call(
        ledger_canister_id,
        "icrc1_transfer",
        (transfer_args,),
    )
    .await
    .map_err(|e| format!("Transfer failed: {:?}", e))?;
    return Ok(tokens);
}


// #[ic_cdk::query]
// pub fn get_profile_image_id(id:String) -> Option<u32> {
//     // let principal = ic_cdk::api::caller();

//     IMAGE_MAP.with(|image_map| {
//         image_map.borrow()
//             .get(&id)
//             .map(|wrapper| wrapper.image_id.parse::<u32>().ok())
//             .flatten() // To convert Option<Result<u32, _>> to Option<u32>
//     })
// }








