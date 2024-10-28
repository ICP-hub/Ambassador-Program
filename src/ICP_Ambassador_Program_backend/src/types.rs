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

// spaces

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub struct SpaceURLs{
    pub telegram:Option<String>,
    pub website:Option<String>,
    pub twitter:Option<String>,
    pub discord:Option<String>,
    pub medium:Option<String>,
    pub github:Option<String>
}

#[derive(CandidType,Deserialize)]
pub struct CreateSpace{
    pub name:String,
    pub slug:String,
    pub description:String,
    pub chain:String
}


// errors 

#[derive(CandidType,Deserialize)]
pub enum UserErrors {
    NoUserFound,

}

#[derive(CandidType,Deserialize)]
pub enum AdminErrors{
    NotASuperAdmin,
    NotOwnerOrSuperAdmin,
    NotRegisteredAsAdmin,
    AlreadyAdmin,
    AlreadySuperAdmin,
    ErrorUpdatingAdmin,
    NoSpaceFound,
    SpaceUpdateError
}