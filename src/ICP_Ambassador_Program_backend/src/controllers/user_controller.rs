use ic_cdk_macros::*;


use crate::{Benefactors, UserLevel, UserProfile, REFERRAL_BENEFICIARY_MAP, USER_PROFILE_MAP};
    
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

#[update]
pub fn get_all_user_benefactors(id:String)->Result<Benefactors,String>{
    let benefactors=REFERRAL_BENEFICIARY_MAP.with(|map| map.borrow().get(&id));

    match benefactors{
        Some(val)=>return Ok(val),
        None=>return Err("No benefactors found!".to_string())
    }
}


// #[update]
// fn add_points(discord_id: String, redeem_points: u64) -> Result<String, String> {
//     if redeem_points == 0 {
//         return Err("Points to add must be greater than zero".to_string());
//     }

//     let mut user_to_update = None;

//     // Fetch the user profile to update if it exists
//     USER_PROFILE_MAP.with(|map| {
//         if let Some(user) = map.borrow().get(&discord_id).clone() {
//             user_to_update = Some(user.clone());
//         }
//     });

//     if let Some(mut user) = user_to_update {
//         // Update the user's redeem_points and xp_points
//         user.redeem_points += redeem_points;
//         user.xp_points += redeem_points;

//         // Check and update user level if necessary
//         let old_level = user.level.clone();
//         user.level = determine_level(user.xp_points);

//         if user.level != old_level {
//             apply_milestone_bonus(&mut user);
//         }

//         // Insert the updated user profile back into USER_PROFILE_MAP
//         USER_PROFILE_MAP.with(|map| {
//             map.borrow_mut().insert(discord_id.clone(), user);
//         });

//         // Fetch the referrer and reward them if they exist
//         let referrer_principal = USER_PROFILE_MAP.with(|map| {
//             map.borrow().get(&discord_id).and_then(|u| u.referrer)
//         });

//         if let Some(referrer) = referrer_principal {
//             reward_referrer(&referrer, redeem_points);
//         }

//         Ok("Points added successfully".to_string())
//     } else {
//         Err("User not found".to_string())
//     }
// }
