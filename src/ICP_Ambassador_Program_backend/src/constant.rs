// errors 

use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType,Deserialize)]
pub enum UserErrors {
    NoUserFound,

}