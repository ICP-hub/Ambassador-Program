use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, Memory};
use candid::{CandidType, Principal};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use ic_stable_structures::storable::Bound;
use std::borrow::Cow;

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
struct UserProfile {
    user_id: String,            // user_id is now of type String (same as discord_id)
    discord_id: String,
    username: String,
    referral_code: Option<String>,
    joined_discord_server: bool,
    wallet: Option<Principal>,
    xp_points: u64,             // Cumulative XP points earned by the user
    redeem_points: u64,         // Redeemable points available to the user
    level: UserLevel,           // Level of the user
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType, PartialEq)]
enum UserLevel {
    Initiate,    // Level 1
    Padawan,     // Level 2
    Knight,      // Level 3
    Master,      // Level 4
    GrandMaster, // Level 5
}

impl Storable for UserProfile {
    const BOUND: Bound = Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        let serialized = serde_cbor::to_vec(self).expect("Failed to serialize UserProfile");
        Cow::Owned(serialized)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        serde_cbor::from_slice(&bytes).expect("Failed to deserialize UserProfile")
    }
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub struct State {
    pub user_profiles: StableBTreeMap<String, UserProfile, DefaultMemoryImpl>,
}

impl State {
    pub fn new() -> Self {
        State {
            user_profiles: StableBTreeMap::new(DefaultMemoryImpl::default()),
        }
    }
}

#[update]
fn create_user(
    user_id: String,
    discord_id: String,
    username: String,
    referral_code: Option<String>,
    joined_discord_server: bool,
    wallet: Option<Principal>
) {
    let user_profile = UserProfile {
        user_id: user_id.clone(),  // Use user_id directly as discord_id
        discord_id,
        username,
        referral_code,
        joined_discord_server,
        wallet,
        xp_points: 1,
        redeem_points: 1,
        level: UserLevel::Initiate,
    };

    STATE.with(|state| {
        state.borrow_mut().user_profiles.insert(user_id, user_profile);
    });
}

#[query]
fn get_user(user_id: String) -> Option<UserProfile> {
    STATE.with(|state| {
        state.borrow().user_profiles.get(&user_id).clone()
    })
}

#[update]
fn update_user(
    user_id: String,
    discord_id: String,
    username: String,
    referral_code: Option<String>,
    joined_discord_server: bool,
    wallet: Option<Principal>
) {
    STATE.with(|state| {
        let user_opt = state.borrow().user_profiles.get(&user_id).clone();

        if let Some(user) = user_opt {
            let updated_profile = UserProfile {
                user_id: user_id.clone(),
                discord_id,
                username,
                referral_code,
                joined_discord_server,
                wallet,
                xp_points: user.xp_points,
                redeem_points: user.redeem_points,
                level: user.level.clone(),
            };

            state.borrow_mut().user_profiles.insert(user_id, updated_profile);
        }
    });
}

#[update]
fn add_points(user_id: String, redeem_points: u64) {
    STATE.with(|state| {
        let user_opt = state.borrow().user_profiles.get(&user_id).clone();

        if let Some(mut user) = user_opt {
            user.redeem_points += redeem_points;
            user.xp_points += redeem_points;  

            user.level = match user.xp_points {
                0..=99 => UserLevel::Initiate,
                100..=999 => UserLevel::Padawan,
                1000..=9999 => UserLevel::Knight,
                10000..=99999 => UserLevel::Master,
                _ => UserLevel::GrandMaster,
            };

            state.borrow_mut().user_profiles.insert(user_id, user);
        }
    });
}

#[update]
fn redeem_points_for_icp(user_id: String, points_to_redeem: u64) -> Result<String, String> {
    STATE.with(|state| {
        let user_opt = state.borrow().user_profiles.get(&user_id).clone();

        if let Some(mut user) = user_opt {
            if user.redeem_points >= points_to_redeem {
                user.redeem_points -= points_to_redeem;
                state.borrow_mut().user_profiles.insert(user_id.clone(), user);

                // ICP transfer logic
                Ok(format!("Successfully redeemed {} points for ICP", points_to_redeem))
            } else {
                Err("Not enough redeem points to complete the transaction".to_string())
            }
        } else {
            Err("User not found".to_string())
        }
    })
}

#[query]
fn get_user_level(user_id: String) -> Option<(UserLevel, u64, u64)> {
    STATE.with(|state| {
        state.borrow().user_profiles.get(&user_id).map(|user| (user.level.clone(), user.xp_points, user.redeem_points))
    })
}

#[init]
fn init() {
    ic_cdk::println!("Canister initialized");
}

ic_cdk::export_candid!();
