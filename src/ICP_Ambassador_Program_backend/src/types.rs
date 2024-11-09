use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

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
}

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum CheckCodeType{
    OneTime,
    ReUsable
}

#[derive(Clone, Debug,CandidType,Deserialize,Serialize)]
pub enum TaskSubmitted{
    SendText{
        text:String
    },
    SendImage{
        img:String
    },
    SendUrl{
        url:String
    }
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
    NoUserFound,
    ErrUpdatingSubmission,
    NoSubmissionFound
}
