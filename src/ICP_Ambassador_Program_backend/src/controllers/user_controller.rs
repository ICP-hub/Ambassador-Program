// use crate::{ state::{self, UserProfile}, types};

// #[ic_cdk::update]
// pub fn create_user(user_details:state::UserProfile)->Option<UserProfile>{

//     let inserted=state::USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(user_details.discord_id.clone(),user_details ));
//     return inserted;
// }

// #[ic_cdk::update]
// pub fn edit_user(user_details:types::UpdateUser)->Result<(),types::UserErrors>{
//     let user=state::USER_PROFILE_MAP.with(|map| map.borrow().get(&user_details.discord_id));
//     match user {
//         Some(value)=> {
//             let new_user:UserProfile=UserProfile{
//                 wallet_id:user_details.wallet_id,
//                 discord_id:value.discord_id,
//                 username:user_details.username,
//                 referral_code:value.referral_code
//             };

//             state::USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(user_details.discord_id, new_user));
//             return Ok(())
//         },
//         None => return Err(types::UserErrors::NoUserFound)
//     }

// }

// #[ic_cdk::query]
// pub fn get_user(id:String)->Result<UserProfile,types::UserErrors>{
//     let user=state::USER_PROFILE_MAP.with(|map| map.borrow().get(&id));

//     match user {
//         Some(value) => return  Ok(value),
//         None => return Err(types::UserErrors::NoUserFound)
//     }
// }


use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, Memory};
use candid::{CandidType, Principal};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::borrow::Cow;
use crate::{state::{USER_PROFILE_MAP,UserProfile}, types::{ UserLevel, UserErrors}};

#[update]
pub fn create_user(
    discord_id: String,
    username: String,
    referral_code: Option<String>,
    wallet: Option<Principal>
) -> Result<(), UserErrors> {
    let user_profile = UserProfile {
        user_id: discord_id.clone(),  // Set user_id to discord_id
        discord_id: discord_id.clone(),
        username,
        referral_code,
        wallet,
        xp_points: 1,
        redeem_points: 1,
        level: UserLevel::Initiate,
    };

    USER_PROFILE_MAP.with(|map| {
        map.borrow_mut().insert(discord_id, user_profile);
    });

    Ok(())
}

#[query]
pub fn get_user(discord_id: String) -> Option<UserProfile> {
    USER_PROFILE_MAP.with(|map| {
        map.borrow().get(&discord_id).clone()
    })
}

#[update]
pub fn update_user(
    discord_id: String,
    username: String,
    referral_code: Option<String>,
    wallet: Option<Principal>
) -> Result<(), UserErrors> {
    USER_PROFILE_MAP.with(|map| {
        if let Some(mut user) = map.borrow().get(&discord_id).clone() {
            user.username = username;
            user.referral_code = referral_code;
            user.wallet = wallet;
            map.borrow_mut().insert(discord_id, user);
            Ok(())
        } else {
            Err(UserErrors::NoUserFound)
        }
    })
}

#[update]
pub fn add_points(discord_id: String, redeem_points: u64) -> Result<(), UserErrors> {
    USER_PROFILE_MAP.with(|map| {
        if let Some(mut user) = map.borrow().get(&discord_id).clone() {
            user.redeem_points += redeem_points;
            user.xp_points += redeem_points;  

            user.level = match user.xp_points {
                0..=99 => UserLevel::Initiate,
                100..=999 => UserLevel::Padawan,
                1000..=9999 => UserLevel::Knight,
                10000..=99999 => UserLevel::Master,
                _ => UserLevel::GrandMaster,
            };

            map.borrow_mut().insert(discord_id, user);
            Ok(())
        } else {
            Err(UserErrors::NoUserFound)
        }
    })
}

#[update]
pub fn redeem_points_for_icp(discord_id: String, points_to_redeem: u64) -> Result<String, UserErrors> {
    USER_PROFILE_MAP.with(|map| {
        if let Some(mut user) = map.borrow().get(&discord_id).clone() {
            if user.redeem_points >= points_to_redeem {
                user.redeem_points -= points_to_redeem;
                map.borrow_mut().insert(discord_id.clone(), user);

                // ICP transfer logic
                Ok(format!("Successfully redeemed {} points for ICP", points_to_redeem))
            } else {
                Err(UserErrors::NoUserFound) // Changed to NoUserFound for consistency
            }
        } else {
            Err(UserErrors::NoUserFound)
        }
    })
}

#[query]
pub fn get_user_level(discord_id: String) -> Option<(UserLevel, u64, u64)> {
    USER_PROFILE_MAP.with(|map| {
        map.borrow()
            .get(&discord_id)
            .map(|user| (user.level.clone(), user.xp_points, user.redeem_points))
    })
}

#[init]
fn init() {
    ic_cdk::println!("Canister initialized");
}

