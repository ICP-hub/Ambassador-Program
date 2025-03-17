mod state;
mod types;
mod constant;
mod controllers;
mod guards;
mod deposit;
use state::*;
use types::*;
use constant::*;
use controllers::*;
use guards::*;
use deposit::*;
use candid::{Principal, Nat};
use icrc_ledger_types::icrc1::transfer::BlockIndex;

use crate::USER_PROFILE_MAP;





ic_cdk::export_candid!();