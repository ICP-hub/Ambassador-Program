use candid::{CandidType, Principal};
use serde::Deserialize;

#[derive(CandidType,Deserialize)]
pub struct UpdateUser{
    pub wallet_id:Option<Principal>,
    pub discord_id:String,
    pub username:String
}