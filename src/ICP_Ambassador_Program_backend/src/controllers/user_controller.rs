use crate::{constant::{self, UserErrors}, state::{self, UserProfile}, types};

#[ic_cdk::update]
pub fn create_user(user_details:state::UserProfile)->Option<UserProfile>{

    let inserted=state::USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(user_details.discord_id.clone(),user_details ));
    return inserted;
}

#[ic_cdk::update]
pub fn edit_user(user_details:types::UpdateUser)->Result<(),constant::UserErrors>{
    let mut user=state::USER_PROFILE_MAP.with(|map| map.borrow().get(&user_details.discord_id));
    match user {
        Some(value)=> {
            let new_user:UserProfile=UserProfile{
                wallet_id:user_details.wallet_id,
                discord_id:value.discord_id,
                username:user_details.username,
                referral_code:value.referral_code
            };

            state::USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(user_details.discord_id, new_user));
            return Ok(())
        },
        None => return Err(constant::UserErrors::NoUserFound)
    }

}

#[ic_cdk::query]
pub fn get_user(id:String)->Result<UserProfile,UserErrors>{
    let user=state::USER_PROFILE_MAP.with(|map| map.borrow().get(&id));

    match user {
        Some(value) => return  Ok(value),
        None => return Err(UserErrors::NoUserFound)
    }
}