use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, Memory};
use candid::{CandidType, Principal};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::borrow::Cow;

// Define the UserProfile struct
#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct UserProfile {
    user_id: u64,
    discord_id: String,
    username: String,
    referral_code: Option<String>,
    referred_by: Option<String>,
    joined_discord_server: bool,
}

// Implement the Storable trait for UserProfile
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

// Define the State struct to hold user profiles with StableBTreeMap
thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

// Use DefaultMemoryImpl for stable memory
pub struct State {
    pub user_profiles: StableBTreeMap<u64, UserProfile, DefaultMemoryImpl>,
}

impl State {
    // Constructor for initializing State
    pub fn new() -> Self {
        State {
            user_profiles: StableBTreeMap::new(DefaultMemoryImpl::default()), // Only one argument is needed here
        }
    }
}


// Add user CRUD operations as canister functions
#[update]
fn create_user(user_id: u64, discord_id: String, username: String, referral_code: Option<String>, referred_by: Option<String>, joined_discord_server: bool) {
    let user_profile = UserProfile {
        user_id,
        discord_id,
        username,
        referral_code,
        referred_by,
        joined_discord_server,
    };

    STATE.with(|state| {
        state.borrow_mut().user_profiles.insert(user_id, user_profile);
    });
}

#[query]
fn get_user(user_id: u64) -> Option<UserProfile> {
    STATE.with(|state| {
        state.borrow().user_profiles.get(&user_id).map(|user| user.clone())
    })
}


#[update]
fn update_user(user_id: u64, discord_id: String, username: String, referral_code: Option<String>, referred_by: Option<String>, joined_discord_server: bool) {
    STATE.with(|state| {
        if let Some(_) = state.borrow().user_profiles.get(&user_id) {
            let updated_profile = UserProfile {
                user_id,
                discord_id,
                username,
                referral_code,
                referred_by,
                joined_discord_server,
            };
            state.borrow_mut().user_profiles.insert(user_id, updated_profile);
        }
    });
}

#[update]
fn delete_user(user_id: u64) {
    STATE.with(|state| {
        state.borrow_mut().user_profiles.remove(&user_id);
    });
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