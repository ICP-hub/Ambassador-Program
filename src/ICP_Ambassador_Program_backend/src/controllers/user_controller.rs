use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, Memory};
use candid::{CandidType, Principal};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};


use crate::{UserProfile,UserLevel,USER_PROFILE_MAP,REFERRAL_TREE};
    
//--
#[update]
fn create_user(
    discord_id: String,
    username: String,
    wallet: Option<Principal>,
    hub: Option<String>,
    referrer_principal: Option<Principal>
) -> Result<String, String> {

    if discord_id.trim().is_empty() || username.trim().is_empty() {
        return Err("Discord ID and Username cannot be empty".to_string());
    }

    let wallet = wallet.ok_or("Wallet is a required field")?;
    let hub = hub.ok_or("Hub is a required field")?;

    let user_exists = USER_PROFILE_MAP.with(|map| map.borrow().contains_key(&discord_id));

    if user_exists {
        return Err("A user with this Discord ID already exists".to_string());
    }

    let wallet_exists = USER_PROFILE_MAP.with(|map| {
        map.borrow().iter().any(|(_, profile)| profile.wallet == Some(wallet))
    });

    if wallet_exists {
        return Err("This wallet principal is already associated with another account".to_string());
    }

    let referrer = referrer_principal.and_then(|principal| {
        USER_PROFILE_MAP.with(|map| {
            map.borrow().iter().find(|(_, profile)| profile.wallet == Some(principal)).map(|(_, _)| principal)
        })
    });

    let user_profile = UserProfile {
        user_id: discord_id.clone(),
        discord_id: discord_id.clone(),
        username,
        wallet: Some(wallet),
        referrer: referrer.clone(),
        hub: Some(hub),
        xp_points: 0,
        redeem_points: 0,
        level: UserLevel::Initiate,
        referrals: Vec::new(),
    };

    USER_PROFILE_MAP.with(|map| {
        map.borrow_mut().insert(discord_id.clone(), user_profile);

        if let Some(referrer_principal) = referrer {
            add_referral(&referrer_principal, wallet);
        }
    });

    Ok("User created successfully".to_string())
}

fn add_referral(referrer_principal: &Principal, referral: Principal) {
    USER_PROFILE_MAP.with(|map| {
        for (_, user) in map.borrow().iter() {
            if user.wallet == Some(*referrer_principal) && user.referrals.len() < max_referrals(&user.level) {
                let mut updated_user = user.clone();
                updated_user.referrals.push(referral);
                map.borrow_mut().insert(updated_user.discord_id.clone(), updated_user);
                break;
            }
        }
    });

    REFERRAL_TREE.with(|tree| {
        let mut tree = tree.borrow_mut();
        let referrals = tree.entry(*referrer_principal).or_default();

        // Ensure the referrer does not exceed 10 referrals
        if referrals.len() < 10 {
            referrals.push(referral);
        }
    });
}


#[update]
fn add_points(discord_id: String, redeem_points: u64) -> Result<String, String> {
    if redeem_points == 0 {
        return Err("Points to add must be greater than zero".to_string());
    }

    let mut user_to_update = None;

    // Fetch the user profile to update if it exists
    USER_PROFILE_MAP.with(|map| {
        if let Some(user) = map.borrow().get(&discord_id).clone() {
            user_to_update = Some(user.clone());
        }
    });

    if let Some(mut user) = user_to_update {
        // Update the user's redeem_points and xp_points
        user.redeem_points += redeem_points;
        user.xp_points += redeem_points;

        // Check and update user level if necessary
        let old_level = user.level.clone();
        user.level = determine_level(user.xp_points);

        if user.level != old_level {
            apply_milestone_bonus(&mut user);
        }

        // Insert the updated user profile back into USER_PROFILE_MAP
        USER_PROFILE_MAP.with(|map| {
            map.borrow_mut().insert(discord_id.clone(), user);
        });

        // Fetch the referrer and reward them if they exist
        let referrer_principal = USER_PROFILE_MAP.with(|map| {
            map.borrow().get(&discord_id).and_then(|u| u.referrer)
        });

        if let Some(referrer) = referrer_principal {
            reward_referrer(&referrer, redeem_points);
        }

        Ok("Points added successfully".to_string())
    } else {
        Err("User not found".to_string())
    }
}

fn reward_referrer(referrer_principal: &Principal, earned_points: u64) {
    let mut referrer_to_update = None;

    USER_PROFILE_MAP.with(|map| {
        for (_, user) in map.borrow().iter() {
            if user.wallet == Some(*referrer_principal) {
                referrer_to_update = Some(user.clone());
                break;
            }
        }
    });

    if let Some(mut user) = referrer_to_update {
        // Calculate fractional points based on user level
        let reward_points = match user.level {
            UserLevel::Knight => earned_points as f64 / 1000.0,
            UserLevel::Master => earned_points as f64 / 100.0,
            UserLevel::GrandMaster => earned_points as f64 / 10.0,
            _ => 0.0,
        };

        // Round the reward points to the nearest whole number
        let rounded_points = reward_points.round() as u64;

        // Add the rounded points to both redeem_points and xp_points
        user.redeem_points += rounded_points;
        user.xp_points += rounded_points;

        // Update the user's profile in USER_PROFILE_MAP
        USER_PROFILE_MAP.with(|map| {
            map.borrow_mut().insert(user.discord_id.clone(), user);
        });
    }
}



#[update]
fn redeem_points_for_icp(discord_id: String, points_to_redeem: u64) -> Result<String, String> {
    if points_to_redeem == 0 {
        return Err("Points to redeem must be greater than zero".to_string());
    }

    USER_PROFILE_MAP.with(|map| {
        if let Some(mut user) = map.borrow().get(&discord_id).clone() {
            if user.redeem_points >= points_to_redeem {
                user.redeem_points -= points_to_redeem;
                map.borrow_mut().insert(discord_id.clone(), user);

                Ok(format!("Successfully redeemed {} points for ICP", points_to_redeem))
            } else {
                Err("Not enough redeem points to complete the transaction".to_string())
            }
        } else {
            Err("User not found".to_string())
        }
    })
}

fn determine_level(xp_points: u64) -> UserLevel {
    match xp_points {
        0..=99 => UserLevel::Initiate,
        100..=999 => UserLevel::Padawan,
        1000..=9999 => UserLevel::Knight,
        10000..=99999 => UserLevel::Master,
        _ => UserLevel::GrandMaster,
    }
}

fn max_referrals(level: &UserLevel) -> usize {
    match level {
        UserLevel::Padawan | UserLevel::Knight | UserLevel::Master | UserLevel::GrandMaster => 10,
        _ => 0,
    }
}


fn apply_milestone_bonus(user: &mut UserProfile) {
    let bonus = match user.level {
        UserLevel::Padawan => 10,
        UserLevel::Knight => 100,
        UserLevel::Master => 1000,
        UserLevel::GrandMaster => 10000,
        _ => 0,
    };

    
    user.redeem_points += bonus;
    user.xp_points += bonus;
}



#[query]
fn get_user_data(discord_id: String) -> Option<UserProfile> {
    USER_PROFILE_MAP.with(|map| map.borrow().get(&discord_id).clone())
}

#[query]
fn get_all_users() -> Vec<UserProfile> {
    USER_PROFILE_MAP.with(|map| map.borrow().iter().map(|(_, user)| user.clone()).collect())
}

#[query]
fn get_all_referrals(principal: Principal, depth: usize) -> Vec<Principal> {
    let mut all_referrals = Vec::new();
    if depth == 0 {
        return all_referrals;
    }

    REFERRAL_TREE.with(|tree| {
        let tree = tree.borrow();
        if let Some(direct_referrals) = tree.get(&principal) {
            all_referrals.extend(direct_referrals.clone());
            for referral in direct_referrals {
                all_referrals.extend(get_all_referrals(*referral, depth - 1));
            }
        }
    });

    all_referrals
}

#[init]
fn init() {
    ic_cdk::println!("Canister initialized");
}