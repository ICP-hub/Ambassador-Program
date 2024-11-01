use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, Memory};
use candid::{CandidType, Principal};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use ic_stable_structures::storable::Bound;
use std::borrow::Cow;

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
struct UserProfile {
    user_id: String,                    // user_id is derived from discord_id
    discord_id: String,
    username: String,
    wallet: Option<Principal>,
    referrer: Option<Principal>,        // Principal of the user who referred them
    hub: Option<String>,                // Selected Hub (instead of KYC)
    xp_points: u64,                     // Cumulative XP points earned by the user
    redeem_points: u64,                 // Redeemable points available to the user
    level: UserLevel,                   // Level of the user
    referrals: Vec<Principal>,          // List of referred users
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
    discord_id: String,
    username: String,
    wallet: Option<Principal>,
    hub: Option<String>,
    referrer_principal: Option<Principal> // Principal of the referring user
) {
    let referrer = STATE.with(|state| {
        let state = state.borrow();
        referrer_principal.and_then(|principal| {
            // Check if the referrer exists in the user profiles map
            state
                .user_profiles
                .iter()
                .find(|(_, profile)| profile.wallet == Some(principal))
                .map(|(_, _)| principal)
        })
    });

    let user_profile = UserProfile {
        user_id: discord_id.clone(),
        discord_id: discord_id.clone(),
        username,
        wallet,
        referrer: referrer.clone(),
        hub,
        xp_points: 0,
        redeem_points: 0,
        level: UserLevel::Initiate,
        referrals: Vec::new(),
    };

    // Add the user profile and add referral if applicable
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.user_profiles.insert(discord_id.clone(), user_profile);

        if let Some(referrer_principal) = referrer {
            add_referral(&mut state, &referrer_principal, wallet.unwrap());
        }
    });
}

fn add_referral(state: &mut State, referrer_principal: &Principal, referral: Principal) {
    for (_, user) in state.user_profiles.iter() {
        if user.wallet == Some(*referrer_principal) && user.referrals.len() < max_referrals(&user.level) {
            let mut updated_user = user.clone();
            updated_user.referrals.push(referral);
            state.user_profiles.insert(updated_user.discord_id.clone(), updated_user);
            break;
        }
    }
}

#[update]
fn add_points(discord_id: String, redeem_points: u64) {
    let mut user_to_update = None;

    // Step 1: Retrieve the user profile and clone it to avoid borrowing conflicts.
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(user) = state.user_profiles.get(&discord_id) {
            user_to_update = Some(user.clone());
        }
    });

    if let Some(mut user) = user_to_update {
        // Step 2: Update the user's points and level.
        user.redeem_points += redeem_points;
        user.xp_points += redeem_points;

        // Store the previous level to determine if milestone bonus is needed.
        let old_level = user.level.clone();
        user.level = determine_level(user.xp_points);

        // Handle milestone bonuses if the level has changed.
        if user.level != old_level {
            apply_milestone_bonus(&mut user);
        }

        // Step 3: Update the user profile in STATE.
        STATE.with(|state| {
            state.borrow_mut().user_profiles.insert(discord_id.clone(), user);
        });

        // Step 4: Reward the referrer if applicable.
        let referrer_principal = STATE.with(|state| {
            state.borrow().user_profiles.get(&discord_id).and_then(|u| u.referrer)
        });

        if let Some(referrer) = referrer_principal {
            reward_referrer(&referrer, redeem_points);
        }
    }
}

fn reward_referrer(referrer_principal: &Principal, earned_points: u64) {
    let mut referrer_to_update = None;

    // Step 1: Retrieve the referrer profile and clone it.
    STATE.with(|state| {
        let state = state.borrow();
        for (_, user) in state.user_profiles.iter() {
            if user.wallet == Some(*referrer_principal) {
                referrer_to_update = Some(user.clone());
                break;
            }
        }
    });

    if let Some(mut user) = referrer_to_update {
        // Step 2: Update the referrer based on the level.
        match user.level {
            UserLevel::Knight => user.redeem_points += earned_points / 1000,  // 0.001 points per earned point
            UserLevel::Master => user.redeem_points += earned_points / 100,   // 0.01 points per earned point
            UserLevel::GrandMaster => user.redeem_points += earned_points / 10, // 0.1 points per earned point
            _ => {}
        }

        // Step 3: Update the referrer profile in STATE.
        STATE.with(|state| {
            state.borrow_mut().user_profiles.insert(user.discord_id.clone(), user);
        });
    }
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
    match user.level {
        UserLevel::Padawan => user.redeem_points += 10,       // Milestone bonus for Padawan
        UserLevel::Knight => user.redeem_points += 100,       // Milestone bonus for Knight
        UserLevel::Master => user.redeem_points += 1000,      // Milestone bonus for Master
        UserLevel::GrandMaster => user.redeem_points += 10000, // Milestone bonus for Grand Master
        _ => {}
    }
}

#[update]
fn redeem_points_for_icp(discord_id: String, points_to_redeem: u64) -> Result<String, String> {
    STATE.with(|state| {
        let user_opt = state.borrow().user_profiles.get(&discord_id).clone();

        if let Some(mut user) = user_opt {
            if user.redeem_points >= points_to_redeem {
                user.redeem_points -= points_to_redeem;
                state.borrow_mut().user_profiles.insert(discord_id.clone(), user);

                //ICP logic from_transfer 

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
fn get_user_data(discord_id: String) -> Option<UserProfile> {
    STATE.with(|state| state.borrow().user_profiles.get(&discord_id).clone())
}

#[query]
fn get_all_users() -> Vec<UserProfile> {
    STATE.with(|state| {
        state.borrow()
            .user_profiles
            .iter()
            .map(|(_, user)| user.clone())
            .collect()
    })
}

#[init]
fn init() {
    ic_cdk::println!("Canister initialized");
}

ic_cdk::export_candid!();
