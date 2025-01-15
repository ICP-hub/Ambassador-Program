use candid::Principal;
use ic_cdk::{caller,update,query};

use crate::{check_anonymous, check_moderator, AdminRole, Editors, Errors, Moderators, Submission, SubmissionStatus, EDITOR_MAP, MISSION_MAP, MODERATOR_MAP, SUBMISSION_MAP};

use super::{is_super_admin, user_controller};

#[update(guard = check_anonymous)]
pub fn register_moderator()->Result<(),Errors>{
    let admin =MODERATOR_MAP.with(|map| map.borrow().get(&caller()));
    
    if admin.is_some(){
        return Err(Errors::AlreadyModerator);
    };

    let new_mod:Moderators=Moderators { 
        wallet_id: caller(),
        role:AdminRole::Moderator,
        spaces:vec![]  
    };

    MODERATOR_MAP.with(|map| map.borrow_mut().insert(caller(), new_mod));
    return Ok(());
}

#[update(guard = check_anonymous)]
pub fn register_editor()->Result<(),Errors>{
    let admin =EDITOR_MAP.with(|map| map.borrow().get(&caller()));
    
    if admin.is_some(){
        return Err(Errors::AlreadyEditor);
    };

    let new_editor:Editors=Editors { 
        wallet_id: caller(),
        role:AdminRole::Editor,
        spaces:vec![]  
    };

    EDITOR_MAP.with(|map| map.borrow_mut().insert(caller(), new_editor));
    return Ok(());
}


#[query(guard =check_moderator)]
pub fn get_moderator()->Result<Moderators,Errors>{
    let moderator = MODERATOR_MAP.with(|map| map.borrow().get(&caller()));
    
    match moderator{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsModerator)
    }
}

#[query(guard = check_anonymous)]
pub fn get_editor()->Result<Editors,Errors>{
    let editor = EDITOR_MAP.with(|map| map.borrow().get(&caller()));
    
    match editor{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsEditor)
    }
}

#[query(guard = check_anonymous)]
pub fn get_moderator_by_principal(id:Principal)->Result<Moderators,Errors>{

    if !is_super_admin(caller()) {
        return Err(Errors::NotASuperAdmin)
    }

    let moderator = MODERATOR_MAP.with(|map| map.borrow().get(&id));
    
    match moderator{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsModerator)
    }
}
#[query(guard = check_anonymous)]
pub fn get_editor_by_principal(id:Principal)->Result<Editors,Errors>{

    if !is_super_admin(caller()) {
        return Err(Errors::NotASuperAdmin)
    }

    let editor = EDITOR_MAP.with(|map| map.borrow().get(&id));
    
    match editor{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsEditor)
    }
}

#[query(guard = check_moderator)]
pub fn verify_task(id:String)->Result<String,String>{
    let old_submission=SUBMISSION_MAP.with(|map| map.borrow().get(&id.clone()));
    let mut new_submission:Submission;
    match old_submission{
        Some(val)=>new_submission=val,
        None=>return Err("no submission found with this id".to_string())
    }
    let mission=MISSION_MAP.with(|map| map.borrow().get(&new_submission.mission_id.clone()));
    match mission{
        Some(mut val)=>{
            if val.max_users_rewarded>0{
                let res=user_controller::update_points(new_submission.user.clone(), val.reward);
                match res{
                    Err(e)=>return Err(e),
                    Ok(_)=>{}
                }
                val.max_users_rewarded-=1;
                new_submission.points_rewarded=true;
                MISSION_MAP.with(|map| map.borrow_mut().insert(val.mission_id.clone(), val));
            }  
        },
        None=>return Err("mission for this submission does not exists".to_string())
    }
    new_submission.status=SubmissionStatus::Approved;
    SUBMISSION_MAP.with(|map| map.borrow_mut().insert(new_submission.submission_id.clone(), new_submission));
    return Ok("still in development".to_string()); 
}




// pub fn is_super_admin(caller:Principal)->bool{
//     let contains=SUPER_ADMIN.with(|arr| arr.borrow().iter().find(|&p| p==caller));

//     if contains.is_none(){
//         return false
//     }

//     return true
// }

// pub fn is_valid_admin(caller:Principal)->bool{
//     let admin=ADMIN_MAP.with(|map| map.borrow().get(&caller));

//     if admin.is_none(){
//         return false
//     }
//     return true;
// }