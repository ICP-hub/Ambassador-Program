use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use candid::Nat;


#[derive(CandidType,Deserialize)]
pub struct UpdateUser{
    pub wallet_id:Option<Principal>,
    pub discord_id:String,
    pub username:String
}
//
#[derive(Clone, Debug, Serialize, Deserialize, CandidType, PartialEq)]
pub enum UserLevel {
    Initiate,    // Level 1
    Padawan,     // Level 2
    Knight,      // Level 3
    Master,      // Level 4
    GrandMaster, // Level 5
}
//
#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct CoverImageData {
    pub content: Option<ByteBuf>,  // The image content for the cover image
    pub ledger_id: Principal,      // Ledger ID associated with the cover image
    // Additional parameters specific to cover images can be added here if needed
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct CreateFileInput {
    // pub parent: u32,
    pub name: String,
    pub content_type: String,
    pub size: Option<Nat>, // if provided, can be used to detect the file is fully filled
    pub content: Option<ByteBuf>, // should <= 1024 * 1024 * 2 - 1024
    pub status: Option<i8>, // when set to 1, the file must be fully filled, and hash must be provided
    pub hash: Option<ByteBuf>, // recommend sha3 256
    pub ert: Option<String>,
    pub crc32: Option<u32>,
}



#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct ProfileImageData {
    pub content: Option<ByteBuf>,
    // You can add more fields if necessary
}

pub type ReturnResult = Result<u32, String>;



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
pub struct CreateMission{
    pub space_id:String,
    pub status:MissionStatus,
    pub title:String,
    pub description:String,
    pub reward:u64,
    pub reward_currency:RewardCurrency,
    pub start_date:String,
    pub end_date:String,
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
    ErrUpdatingMissionCount,
    MissionNotFound,
    MissionInActive,
    ErrUpdatingMission,
    
}
