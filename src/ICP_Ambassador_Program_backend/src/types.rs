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

// missions 
#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum MissionStatus{
    Draft,
    Active,
    UnActive
}

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum RewardCurrency{
    ICP,
    CKBTC,
    CKETH
}
#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum Tasks{
    SendTweet{
        title:String,
        body:String,
        url:String
    },
    FollowTwitter{
        title:String,
        body:String,
        account:String
    },
    JoinTelegram{
        title:String,
        body:String,
        link:String,
        channel:String
    },
    PuzzleText{
        description:String,
        score:u32,
        item_length:u16,
        items:Vec<String>
    },
    SendImage{
        title:String,
        body:String,
        img:String
    },
    SendText{
        title:String,
        body:String,
        sample:String,
        validation_rule:String,
        max_len:u16
    },
    SendUrl{
        title:String,
        body:String
    },
    CheckCode{
        title:String,
        body:String,
        code_type:CheckCodeType,
        code_list:Vec<String>
    },
    // API type not added
    GoToLink{
        title:String,
        link:String,
        btn_text:String
    },
    CheckMission{
        title:String,
        body:String,
        mission_id:String
    }
}

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum CheckCodeType{
    OneTime,
    ReUsable
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
    SpaceUpdateError,
}