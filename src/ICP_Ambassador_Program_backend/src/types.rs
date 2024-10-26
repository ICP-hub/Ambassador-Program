use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType,Deserialize)]
pub struct UpdateUser{
    pub wallet_id:Option<Principal>,
    pub discord_id:String,
    pub username:String
}

// admin

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum AdminRole{
    SuperAdmin,
    HubLeader
}



// errors 

#[derive(CandidType,Deserialize)]
pub enum UserErrors {
    NoUserFound,

}

pub enum AdminErrors{
    NotASuperAdmin,
    NotAnAdmin,
}