use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use std::fmt;

#[derive(CandidType,Deserialize)]
pub struct UpdateUser{
    pub wallet_id:Option<Principal>,
    pub discord_id:String,
    pub username:String
}
//
#[derive(Clone, Debug, Serialize, Deserialize, CandidType, PartialEq)]
pub enum UserLevel {
    Initiate, 
    Padawan,  
    Knight,   
    Master,   
    GrandMaster,
}

impl fmt::Display for UserLevel {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            UserLevel::Initiate => write!(f, "Initiate"),
            UserLevel::Padawan => write!(f, "Padawan"),
            UserLevel::Knight => write!(f, "Knight"),
            UserLevel::Master => write!(f, "Master"),
            UserLevel::GrandMaster => write!(f, "GrandMaster"),
        }
    }
}

// admin

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum AdminRole{
    SuperAdmin,
    HubLeader,
    Moderator,
    Editor
}
// pub enum ModeratorRole{
// Moderator
// }
// pub enum EditorRole{
//     Editor
// }

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
    pub chain:String,
    pub conversion:u16
}

// missions 
#[derive(Clone, Debug,CandidType,Deserialize,Serialize,PartialEq)]
pub enum MissionStatus{
    Draft,
    Active,
    UnActive,
    Expired,
}

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum RewardCurrency{
    ICP,
    CKBTC,
    CKETH
}
#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum Tasks{
    
    SendImage{
        id:u8,
        title:String,
        body:String,
        img:String
    },
    SendText{
        id:u8,
        title:String,
        body:String,
        sample:String,
        validation_rule:String,
        max_len:u16
    },
    SendUrl{
        id:u8,
        title:String,
        body:String
    },
    SendTwitterPost{
        id:u8,
        title:String,
        body:String
    },
    TwitterFollow{
        id:u8,
        title:String,
        body:String,
        account:String
    }
 
    // These might be needed in future for implementation

    // SendTweet{
    //     title:String,
    //     body:String,
    //     url:String
    // },
    // FollowTwitter{
    //     title:String,
    //     body:String,
    //     account:String
    // },
    // JoinTelegram{
    //     title:String,
    //     body:String,
    //     link:String,
    //     channel:String
    // },
    // PuzzleText{
    //     description:String,
    //     score:u32,
    //     item_length:u16,
    //     items:Vec<String>
    // },
    // CheckCode{
    //     title:String,
    //     body:String,
    //     code_type:CheckCodeType,
    //     code_list:Vec<String>
    // },
    // // API type not added
    // GoToLink{
    //     title:String,
    //     link:String,
    //     btn_text:String
    // },
    // CheckMission{
    //     title:String,
    //     body:String,
    //     mission_id:String
    // }
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
    pub max_users_rewarded:u64,
    pub pool:u64
}
#[derive(CandidType)]
pub struct TransferResultICRC1 {
    result: Result<Nat, String>
}

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum CheckCodeType{
    OneTime,
    ReUsable
}

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum TaskSubmitted{
    SendText{
        id:u8,
        text:String
    },
    SendImage{
        id:u8,
        img:String
    },
    SendUrl{
        id:u8,
        url:String
    },
    SendTwitterPost{
        id:u8,
        post:String
    },
    TwitterFollow{
        id:u8,
        followed:bool
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType,PartialEq)]
pub enum SubmissionStatus{
    Approved,
    Rejected,
    Unread
}

// errors 

#[derive(CandidType,Deserialize)]
pub enum UserErrors {
    NoUserFound,

}

#[derive(CandidType,Deserialize)]
pub enum Errors{
    NotASuperAdmin,
    NotOwnerOrSuperAdmin,
    NotRegisteredAsAdmin,
    NotRegisteredAsModerator,
    NotRegisteredAsEditor,
    AlreadyAdmin,
    AlreadyModerator,
    AlreadyEditor,
    AlreadySuperAdmin,
    ErrorUpdatingAdmin,
    NotASpaceModerator,
    NoSpaceFound,
    SpaceUpdateError,
    ErrUpdatingMissionCount,
    MissionNotFound,
    MissionInActive,
    ErrUpdatingMission,
    NoUserFound,
    ErrUpdatingSubmission,
    NoSubmissionFound,
    ReferrerNotFound,
    SubmissionAlreadyReviewed,
    NotAuthorized,
    InvalidInput,
    NoMissionFound,
    FailedToUnlockFunds
}


// asset canister types

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

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct UserReferDetails {
    pub username: String,
    pub rank: UserLevel,
    pub xp_points: u64,
}

pub type ReturnResult = Result<u32, String>;


// define leaderboard types
#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct LeaderboardEntry {
    pub name: String,
    pub rank: String,
    pub points: u64,
}
