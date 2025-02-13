use candid::{Nat, Principal};
use ic_cdk::{caller, query, update};
// use uuid::Uuid;
use super::check_moderator;
use super::is_valid_admin;
use crate::deposit::deposit_icp_to_canister;

use crate::{
    check_anonymous, Admin, CreateSpace, Errors, FundEntry, Space, SpaceURLs, ADMIN_MAP,
    SPACE_FUND_MAP, SPACE_MAP,
};
 
// Access Control : Owner/Admin
#[update(guard = check_anonymous)]
pub fn create_space(space: CreateSpace) -> Result<Option<Space>, Errors> {
    if !is_valid_admin(caller()) {
        return Err(Errors::NotRegisteredAsAdmin);
    }

    let space_id = match genrate_space_id(caller()) {
        Ok(id) => id,
        Err(e) => return Err(e),
    };

    // Validate input data
    if !is_valid_utf8(&space.name) || !is_valid_utf8(&space.slug) || !is_valid_utf8(&space.description) {
        return Err(Errors::InvalidInput);
    }

    let new_space = Space {
        space_id: space_id.clone(),
        name: space.name,
        slug: space.slug,
        description: space.description,
        owner: caller(),
        chain: space.chain,
        logo: None,
        bg_css: None,
        shor_description: None,
        bg_img: None,
        urls: SpaceURLs {
            telegram: None,
            website: None,
            medium: None,
            twitter: None,
            discord: None,
            github: None,
        },
        mission_count: 0,
        conversion: space.conversion,
        moderators: Vec::new(),
        editors: Vec::new(),
    };

    let inserted = SPACE_MAP.with(|map| {
        map.borrow_mut()
            .insert(space_id, new_space)
    });
    Ok(inserted)
}

// Helper function to validate UTF-8
fn is_valid_utf8(s: &str) -> bool {
    std::str::from_utf8(s.as_bytes()).is_ok()
}

// Access Control : Moderator
#[update(guard = check_anonymous)]
pub fn update_space(updated_space: Space) -> Result<(), Errors> {
    // Check if the space exists in SPACE_MAP
    let old_space = SPACE_MAP.with(|map| map.borrow().get(&updated_space.space_id));

    match old_space {
        Some(_) => {
            
            // Ensure the caller has the right permissions to update the space
            if !check_moderator(caller(), updated_space.space_id.clone()).is_ok(){
                return Err(Errors::NotAuthorized);
            }

            // Update the space in SPACE_MAP
            let updated = SPACE_MAP.with(|map| {
                map.borrow_mut()
                    .insert(updated_space.space_id.clone(), updated_space)
            });

            match updated {
                Some(_) => Ok(()),                     // Successfully updated the space
                None => Err(Errors::SpaceUpdateError), // Failed to update the space
            }
        }
        None => Err(Errors::NoSpaceFound), // Space does not exist
    }
}

// Access Control : Open
#[query]
pub fn get_space(space_id: String) -> Result<Space, Errors> {

    let space = SPACE_MAP.with(|map| map.borrow().get(&space_id));

    match space {
        Some(value) => return Ok(value),
        None => return Err(Errors::NoSpaceFound),
    }
}

// Func to get all spaces for an admin (currently not in use)
// #[query(guard = check_anonymous)]
// pub fn get_all_admin_spaces() -> Result<Vec<String>, Errors> {
//     let admin = ADMIN_MAP.with(|map| map.borrow().get(&caller()));
//     if admin.is_none() {
//         return Err(Errors::NotRegisteredAsAdmin);
//     }
//     return Ok(admin.unwrap().spaces);
// }

// Access Control : Open
#[query]
pub fn get_all_spaces() -> Result<Vec<(String, Space)>, Errors> {
    let spaces: Vec<(String, Space)> = SPACE_MAP.with(|map| map.borrow().iter().collect());
    return Ok(Vec::from_iter(spaces));
}

// function to withdraw funds from a space (Currently not in use)
// #[update]
// pub fn withdraw_funds(id: String, amount: u64) -> Result<String, String> {
//     let space = SPACE_MAP.with(|map| map.borrow().get(&id));
//     let space_val: Space;
//     match space {
//         Some(val) => space_val = val,
//         None => return Err(String::from("No space found to lock funds for")),
//     }
//     let funds = SPACE_FUND_MAP.with(|map| map.borrow().get(&space_val.space_id.clone()));
//     let mut fund_val: FundEntry;
//     match funds {
//         Some(val) => fund_val = val,
//         None => {
//             fund_val = FundEntry {
//                 balance: 0,
//                 locked: 0,
//                 space_id: space_val.space_id.clone(),
//             }
//         }
//     }
//     let avalable_fund = fund_val.balance - fund_val.locked - 10_000;
//     if avalable_fund < amount {
//         return Err(String::from(
//             "Insufficient funds for this action, please add more funds",
//         ));
//     }
//     fund_val.balance -= amount;
//     SPACE_FUND_MAP.with(|map| map.borrow_mut().insert(space_val.space_id, fund_val));
//     return Ok(String::from(
//         "funds withdrawal successful, ICRC transaction needs to be implemented",
//     ));
// }

// Access Control : Owner/Admin
#[update]
pub async fn add_funds(id: String, amount: u64) -> Result<String, String> {
    ic_cdk::println!("Adding funds to space {}", id);
    ic_cdk::println!("Amount: {}", Nat::from(amount),);

    if !is_valid_admin(caller()) {
        return Err(String::from("Not registered as an admin"));
    }
    let space = SPACE_MAP.with(|map| map.borrow().get(&id));
    let space_val: Space;
    match space {
        Some(val) => {
            space_val = val;
            // Ensure the caller is the owner of the space
            if space_val.owner != caller(){
                return Err(String::from("Not authorized to add funds"));
            } else {
                ic_cdk::println!("Caller is authorized to add funds");

                // icrc transaction should take place here
                deposit_icp_to_canister(amount).await?;

                let funds =
                    SPACE_FUND_MAP.with(|map| map.borrow().get(&space_val.space_id.clone()));
                let mut fund_val: FundEntry;
                match funds {
                    Some(val) => fund_val = val,
                    None => {
                        fund_val = FundEntry {
                            balance: 0,
                            locked: 0,
                            space_id: space_val.space_id.clone(),
                        }
                    }
                }
                fund_val.balance += amount;
                SPACE_FUND_MAP.with(|map| map.borrow_mut().insert(space_val.space_id, fund_val));
                return Ok(String::from(
                    "Added new funds, ICRC transfer needs to be implemented here",
                ));
            }
        }
        None => return Err(String::from("No space found to add funds to")),
    }
}

pub fn lock_funds(id: String, amount: u64) -> Result<(), String> {
    let space = SPACE_MAP.with(|map| map.borrow().get(&id));
    let space_val: Space;
    match space {
        Some(val) => space_val = val,
        None => return Err(String::from("No space found to lock funds for")),
    }
    let funds = SPACE_FUND_MAP.with(|map| map.borrow().get(&space_val.space_id.clone()));
    let mut fund_val: FundEntry;
    match funds {
        Some(val) => fund_val = val,
        None => {
            fund_val = FundEntry {
                balance: 0,
                locked: 0,
                space_id: space_val.space_id.clone(),
            }
        }
    }
    let avalable_fund = fund_val.balance - fund_val.locked;
    if avalable_fund < amount {
        return Err(String::from(
            "Insufficient funds for this action, please add more funds",
        ));
    }
    fund_val.locked += amount;
    SPACE_FUND_MAP.with(|map| map.borrow_mut().insert(space_val.space_id, fund_val));
    return Ok(());
}

pub fn unlock_funds(id: String, amount: u64) -> Result<(), String> {
    let space = SPACE_MAP.with(|map| map.borrow().get(&id));
    let space_val: Space;
    match space {
        Some(val) => space_val = val,
        None => return Err(String::from("No space found to lock funds for")),
    }
    let funds = SPACE_FUND_MAP.with(|map| map.borrow().get(&space_val.space_id.clone()));
    let mut fund_val: FundEntry;
    match funds {
        Some(val) => fund_val = val,
        None => {
            fund_val = FundEntry {
                balance: 0,
                locked: 0,
                space_id: space_val.space_id.clone(),
            }
        }
    }
    // let avalable_fund=fund_val.balance-fund_val.locked;
    if fund_val.locked < amount {
        return Err(String::from(
            "Insufficient funds for this action, please add more funds",
        ));
    }
    fund_val.locked -= amount;
    SPACE_FUND_MAP.with(|map| map.borrow_mut().insert(space_val.space_id, fund_val));
    return Ok(());
}

// Access Control : Open
#[query]
pub fn get_fund_details(id: String) -> Option<FundEntry> {
    return SPACE_FUND_MAP.with(|map| map.borrow().get(&id));
}

// func to generate space id for new space
fn genrate_space_id(id: Principal) -> Result<String, Errors> {
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&id));
    let mut new_admin: Admin = admin.unwrap();

    let space_id = format!("{}_{}", Principal::to_text(&id), new_admin.spaces.len());
    new_admin.spaces.push(space_id.clone());

    let updated = ADMIN_MAP.with(|map| map.borrow_mut().insert(id, new_admin));

    match updated {
        Some(_) => Ok(space_id),
        None => Err(Errors::NotRegisteredAsAdmin),
    }
}

// func to assign a space to an admin (for Moderators and Editors)
pub fn assign_admin_space(id: Principal, space_id: String) -> Result<(), Errors> {
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&id));
    let mut new_admin: Admin = admin.unwrap();
    new_admin.spaces.push(space_id.clone());

    let updated = ADMIN_MAP.with(|map| map.borrow_mut().insert(id, new_admin));

    match updated {
        Some(_) => Ok(()),
        None => Err(Errors::NotRegisteredAsAdmin),
    }
}
