mod state;
mod types;
mod constant;
mod controllers;
mod guards;
mod deposit;
use ic_cdk::{post_upgrade, pre_upgrade};
use state::*;
use types::*;
use constant::*;
use controllers::*;
use guards::*;
use deposit::*;
use candid::{Principal, Nat};
use icrc_ledger_types::icrc1::transfer::BlockIndex;

use crate::USER_PROFILE_MAP;

#[pre_upgrade]
fn pre_upgrade() {
    let profiles: Vec<(String, UserProfile)> = USER_PROFILE_MAP.with(|map| {
        map.borrow()
            .iter()
            .map(|(key, profile)| (key.clone(), profile.clone()))
            .collect()
    });

    ic_cdk::storage::stable_save((profiles,)).expect("Failed to save user profiles before upgrade");
}

#[post_upgrade]
fn post_upgrade() {
    let restored_data: Result<(Vec<(String, UserProfile)>,), _> =
        ic_cdk::storage::stable_restore();

    if let Ok((profiles,)) = restored_data {
        for (key, mut profile) in profiles {
            // Ensure new fields are set with default values if missing
            if profile.twitter_username.is_none() {
                profile.twitter_username = None;
            }
            if profile.telegram_username.is_none() {
                profile.telegram_username = None;
            }
            if profile.profile_picture.is_none() {
                profile.profile_picture = None;
            }

            USER_PROFILE_MAP.with(|map| {
                map.borrow_mut().insert(key, profile);
            });
        }
    }
}




ic_cdk::export_candid!();