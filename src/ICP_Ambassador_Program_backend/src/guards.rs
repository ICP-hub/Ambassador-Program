use candid::Principal;
use ic_cdk::caller;
use crate::MODERATOR_MAP;

use crate::ANONYMOUS_USER;

pub fn check_anonymous() -> Result<(), String> {
    if caller() == Principal::anonymous() {
        return Err(String::from(ANONYMOUS_USER));
    }
    Ok(())
}
