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
    Initiate, 
    Padawan,  
    Knight,   
    Master,   
    GrandMaster,
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
    NoSubmissionFound,
    ReferrerNotFound,
    SubmissionAlreadyReviewed
}
