use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::*;


use crate::{Benefactors, UserLevel, UserProfile, ICRC_DECIMALS, REFERRAL_BENEFICIARY_MAP, SPACE_MAP, USER_PROFILE_MAP};

use super::transfer_amount;
    
//--
#[update]
pub fn create_user(
    discord_id: String,
    username: String,
    hub: String,
    referred_by: Option<String>
) -> Result<String, String> {

    if discord_id.trim().is_empty() || username.trim().is_empty() {
        return Err("Discord ID and Username cannot be empty".to_string());
    }

    let user_exists = USER_PROFILE_MAP.with(|map| map.borrow().contains_key(&discord_id));

    if user_exists {
        return Err("A user with this Discord ID already exists".to_string());
    }
    let ref_user_id:String;
    match referred_by{
        Some(val)=>ref_user_id=val,
        None=>ref_user_id=String::from("")
    }
    if ref_user_id!=String::from(""){
        let referred_by_user=USER_PROFILE_MAP.with(|map| map.borrow().get(&ref_user_id));

        match referred_by_user{
            Some(_) => {},
            None => return Err("Invalid referrer".to_string())
        }

        let add_ref_result=add_referral(ref_user_id.clone(), discord_id.clone());
        match add_ref_result{
            Ok(_)=>{},
            Err(e)=>return Err(e)
        }
    }
    

    let new_user = UserProfile {
        discord_id: discord_id.clone(),
        username,
        wallet: None,
        hub,
        xp_points: 0,
        redeem_points: 0,
        level: UserLevel::Initiate,
        direct_refers:vec![],
        referred_by:Some(ref_user_id)
    };
    USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(discord_id, new_user));

    Ok("User created successfully".to_string())
}

fn add_referral(referrer: String, user: String)->Result<(),String> {
    
    let ref_user=USER_PROFILE_MAP.with(|map| map.borrow().get(&referrer));
    let mut ref_user_val:UserProfile;

    match ref_user {
        Some(val)=>ref_user_val=val,
        None=> return Err("invalid referral".to_string())
    };
    if ref_user_val.direct_refers.len()>=10{
        return Err("user already referred 10 users!".to_string());
    };
    let parent_benefactors=REFERRAL_BENEFICIARY_MAP.with(|map| map.borrow().get(&referrer));
    let mut parent_banefactor_val:Vec<String>;

    match parent_benefactors {
        Some(val)=>parent_banefactor_val=val.benefactors,
        None => parent_banefactor_val=vec![]
    };

    if parent_banefactor_val.len()>4{
        let mut new_vec:Vec<String>=vec![];
        for i in 1..5{
            new_vec.push(parent_banefactor_val[i].clone());
        }
        parent_banefactor_val=new_vec;
    };
    parent_banefactor_val.push(referrer.clone());
    let user_benefactors:Benefactors=Benefactors{
        benefactors:parent_banefactor_val,
        user:user.clone()
    };

    REFERRAL_BENEFICIARY_MAP.with(|map| map.borrow_mut().insert(user.clone(), user_benefactors));
    ref_user_val.direct_refers.push(user);
    USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(referrer, ref_user_val));
    return Ok(());
}

// func to get all benefactors of a user (Currently not used)
// #[update]
// pub fn get_all_user_benefactors(id:String)->Result<Benefactors,String>{
//     let benefactors=REFERRAL_BENEFICIARY_MAP.with(|map| map.borrow().get(&id));
//     match benefactors{
//         Some(val)=>return Ok(val),
//         None=>return Err("No benefactors found!".to_string())
//     }
// }

#[query]
pub fn get_user_data(id:String)->Option<UserProfile>{
    return USER_PROFILE_MAP.with(|map| map.borrow().get(&id));
}

pub fn update_points(discord_id: String,points:u64)->Result<(),String>{
    if points==0{
        return Ok(())
    }
    let old_user=USER_PROFILE_MAP.with(|map| map.borrow().get(&discord_id));
    let mut new_user:UserProfile;

    match old_user{
        Some(val)=>new_user=val,
        None=>return Err("No user found to update points".to_string())
    }

    new_user.xp_points+=points;
    new_user.redeem_points+=points;

    let new_level=determine_level(new_user.xp_points);
    if new_user.level != new_level{
        new_user.level=new_level.clone();
        match new_level {
            UserLevel::Initiate=>{},
            UserLevel::Padawan=>{
                new_user.xp_points+=10;
                new_user.redeem_points+=10
            },
            UserLevel::Knight=>{
                new_user.xp_points+=100;
                new_user.redeem_points+=100;
            },
            UserLevel::Master=>{
                new_user.xp_points+=1000;
                new_user.redeem_points+=1000;
            },
            UserLevel::GrandMaster=>{
                new_user.xp_points+=10000;
                new_user.redeem_points+=10000;
            }
        }
    }

    USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(new_user.discord_id.clone(), new_user));
    return Ok(());
}

fn determine_level(points:u64)->UserLevel{
    match points {
        0..=99=>UserLevel::Initiate,
        100..=999=>UserLevel::Padawan,
        1000..=9999=>UserLevel::Knight,
        10000..=99999=>UserLevel::Master,
        _=>UserLevel::GrandMaster
    }
}

#[update]
pub fn add_wallet(id:String)->Result<String,String>{
    let user=USER_PROFILE_MAP.with(|map| map.borrow().get(&id.clone()));
    let mut user_mut:UserProfile;

    match user{
        Some(val)=>user_mut=val,
        None=>return Err(String::from("No user found with this id"))
    }
    user_mut.wallet=Some(caller());
    USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(id, user_mut));
    return Ok(String::from("User wallet updated"))
}

// update this function to tranfer funds on provide wallet id
#[update]
pub async fn withdraw_points(id:String,receiver:Principal,points:u64)->Result<String,String>{
    let user=USER_PROFILE_MAP.with(|map| map.borrow().get(&id.clone()));
    let mut user_mut:UserProfile;
    let wallet=receiver;
    match user{
        Some(val)=>user_mut=val,
        None=>return Err(String::from("User not found"))
    }
    // match user_mut.wallet {
    //     Some(val)=>wallet=val,
    //     None=>return
    //      Err(String::from("user wallet not set"))
    // }
    if points>user_mut.redeem_points {
        return Err(String::from("Not enough redeemable points"))
    }
    let amount:u64;
    
    //transfer amount to user's wallet
    let space=SPACE_MAP.with(|map| map.borrow().get(&user_mut.hub.clone()));
    match space{
        Some(space_val)=>{
            amount=points*u64::from(space_val.conversion)*ICRC_DECIMALS/1000;
            let transfer_res=transfer_amount(amount, wallet).await;
            match transfer_res{
                Ok(_)=>{},
                Err(e)=>return Err(e)
            }
        },
        None=>return Err(String::from("Invalid hub for the user"))
    }
    user_mut.redeem_points-=points;
    USER_PROFILE_MAP.with(|map| map.borrow_mut().insert(id,user_mut));
    return Ok(String::from("amount redeemed to user"))
}

