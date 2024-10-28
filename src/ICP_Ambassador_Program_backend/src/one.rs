// use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, Memory};
// use candid::{CandidType, Principal};
// use ic_cdk_macros::*;
// use serde::{Deserialize, Serialize};
// use std::cell::RefCell;
// use std::borrow::Cow;

// // Define UserProfile struct
// #[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
// struct UserProfile {
//     user_id: u64,
//     discord_id: String,
//     username: String,
//     referral_code: String, // Unique referral code for the user
//     referred_by: Option<String>, // Referral code of the referring user
//     joined_discord_server: bool,
//     wallet: Option<Principal>,
//     points: u64,
//     level: u64,
// }

// // Implement Storable for UserProfile
// impl Storable for UserProfile {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

//     fn to_bytes(&self) -> Cow<[u8]> {
//         let serialized = serde_cbor::to_vec(self).expect("Failed to serialize UserProfile");
//         Cow::Owned(serialized)
//     }

//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         serde_cbor::from_slice(&bytes).expect("Failed to deserialize UserProfile")
//     }
// }

// // Define thread-local state
// thread_local! {
//     static STATE: RefCell<State> = RefCell::new(State::new());
// }

// // State struct to hold user profiles
// pub struct State {
//     pub user_profiles: StableBTreeMap<u64, UserProfile, DefaultMemoryImpl>,
// }

// impl State {
//     pub fn new() -> Self {
//         State {
//             user_profiles: StableBTreeMap::new(DefaultMemoryImpl::default()),
//         }
//     }
// }

// // Generate a unique referral code
// fn generate_referral_code(user_id: u64) -> String {
//     format!("REF{}", user_id) // Example format
// }

// // Create a new user
// #[update]
// fn create_user(
//     user_id: u64,
//     discord_id: String,
//     username: String,
//     referral_code: Option<String>,
//     joined_discord_server: bool,
//     wallet: Option<Principal>
// ) {
//     let code = generate_referral_code(user_id);
//     let referred_by = referral_code;

//     let user_profile = UserProfile {
//         user_id,
//         discord_id,
//         username,
//         referral_code: code,
//         referred_by,
//         joined_discord_server,
//         wallet,
//         points: 1,
//         level: 1,
//     };

//     STATE.with(|state| {
//         state.borrow_mut().user_profiles.insert(user_id, user_profile);
//     });

//     // Reward the referrer if applicable
//     if let Some(referrer_code) = referred_by {
//         // Logic to find the referrer based on the referral code
//         STATE.with(|state| {
//             if let Some(referrer) = state.borrow().user_profiles.iter().find(|(_, user)| user.referral_code == referrer_code) {
//                 let referrer_id = referrer.0;

//                 // Reward both the referrer and the new user
//                 add_points(referrer_id, 10); // Example: 10 points for referrer
//                 add_points(user_id, 5); // Example: 5 points for the new user
//             }
//         });
//     }
// }

// // Add points to a user
// fn add_points(user_id: u64, points: u64) {
//     STATE.with(|state| {
//         if let Some(mut user) = state.borrow_mut().user_profiles.get_mut(&user_id) {
//             user.points += points;

//             user.level = match user.points {
//                 0..=99 => 1,
//                 100..=999 => 2,
//                 1000..=9999 => 3,
//                 10000..=99999 => 4,
//                 _ => 5,
//             };

//             state.borrow_mut().user_profiles.insert(user_id, user.clone());
//         }
//     });
// }

// // Read user profile by user_id
// #[query]
// fn get_user(user_id: u64) -> Option<UserProfile> {
//     STATE.with(|state| {
//         state.borrow().user_profiles.get(&user_id).cloned()
//     })
// }

// // Update user profile
// #[update]
// fn update_user(
//     user_id: u64,
//     discord_id: String,
//     username: String,
//     referral_code: Option<String>,
//     joined_discord_server: bool,
//     wallet: Option<Principal>
// ) {
//     STATE.with(|state| {
//         if let Some(user) = state.borrow().user_profiles.get_mut(&user_id) {
//             let updated_profile = UserProfile {
//                 user_id,
//                 discord_id,
//                 username,
//                 referral_code: user.referral_code.clone(),
//                 referred_by: user.referred_by.clone(),
//                 joined_discord_server,
//                 wallet,
//                 points: user.points,
//                 level: user.level,
//             };

//             state.borrow_mut().user_profiles.insert(user_id, updated_profile);
//         }
//     });
// }

// // Get user level and points
// #[query]
// fn get_user_level(user_id: u64) -> Option<(u64, u64)> {
//     STATE.with(|state| {
//         state.borrow().user_profiles.get(&user_id).map(|user| (user.level, user.points))
//     })
// }

// // Initialize canister
// #[init]
// fn init() {
//     ic_cdk::println!("Canister initialized");
// }

// // Export Candid interface for the canister
// ic_cdk::export_candid!();
