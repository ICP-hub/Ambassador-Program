use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, Memory};
use candid::{CandidType, Principal};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::borrow::Cow;

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
struct UserProfile {
    user_id: u64,
    discord_id: String,
    username: String,
    referral_code: Option<String>,
    joined_discord_server: bool,
    wallet: Option<Principal>,
    points: u64,
    level: u64,
}

impl Storable for UserProfile {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

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
    pub user_profiles: StableBTreeMap<u64, UserProfile, DefaultMemoryImpl>,
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
    user_id: u64,
    discord_id: String,
    username: String,
    referral_code: Option<String>,
    joined_discord_server: bool,
    wallet: Option<Principal>
) {
    let user_profile = UserProfile {
        user_id,
        discord_id,
        username,
        referral_code,
        joined_discord_server,
        wallet,
        points: 1,
        level: 1,
    };

    STATE.with(|state| {
        state.borrow_mut().user_profiles.insert(user_id, user_profile);
    });
}

#[query]
fn get_user(user_id: String) -> Option<UserProfile> {
    let user_id = match user_id.parse::<u64>() {
        Ok(id) => id,
        Err(_) => {
            ic_cdk::trap("Failed to parse user_id as u64");
            return None;
        }
    };

    STATE.with(|state| {
        state.borrow().user_profiles.get(&user_id).clone()
    })
}

#[update]
fn update_user(
    user_id: u64,
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
                user_id,
                discord_id,
                username,
                referral_code,
                joined_discord_server,
                wallet,
                points: user.points,
                level: user.level,
            };

            state.borrow_mut().user_profiles.insert(user_id, updated_profile);
        }
    });
}

#[update]
fn add_points(user_id: u64, points: u64) {
    STATE.with(|state| {
        let user_opt = state.borrow().user_profiles.get(&user_id).clone();

        if let Some(mut user) = user_opt {
            user.points += points;

            user.level = match user.points {
                0..=99 => 1,
                100..=999 => 2,
                1000..=9999 => 3,
                10000..=99999 => 4,
                _ => 5,
            };

            state.borrow_mut().user_profiles.insert(user_id, user);
        }
    });
}

#[query]
fn get_user_level(user_id: u64) -> Option<(u64, u64)> {
    STATE.with(|state| {
        state.borrow().user_profiles.get(&user_id).map(|user| (user.level, user.points))
    })
}

#[init]
fn init() {
    ic_cdk::println!("Canister initialized");
}



// // Test function to add a default user for demonstration
// #[init]
// fn init() {
//     let default_user = UserProfile {
//         user_id: 1,
//         discord_id: "123456".to_string(),
//         username: "test_user".to_string(),
//         referral_code: Some("ref123".to_string()),
//         referred_by: None,
//         joined_discord_server: true,
//     };
//     STATE.with(|state| {
//         state.borrow_mut().user_profiles.insert(default_user.user_id, default_user);
//     });
// }

ic_cdk::export_candid!();