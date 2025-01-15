use ic_cdk_macros::*;
mod state;
mod types;
mod constant;
mod controllers;
mod guards;
mod deposit;
use deposit::*;
use guards::*;
use state::*;
use controllers::*;
use state::*;
use types::*;
use constant::*;
use candid::{Principal, Nat};
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use icrc_ledger_types::icrc1::account::Account;

ic_cdk::export_candid!();