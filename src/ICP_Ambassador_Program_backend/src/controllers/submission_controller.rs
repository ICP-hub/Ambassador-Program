use ic_cdk::{query, update};

use crate::{Errors, Submission, UserProfile, MISSION_MAP, SUBMISSION_MAP, USER_PROFILE_MAP};

#[update]
pub fn add_or_update_submission(submission:Submission)->Result<(),Errors>{

    let user=USER_PROFILE_MAP.with(|map| map.borrow().get(&submission.user));
    let user_val:UserProfile;
    match user{
        Some(value) => user_val=value,
        None => return Err(Errors::NoUserFound)
    }

    let mission=MISSION_MAP.with(|map| map.borrow().get(&submission.mission_id));
        match mission {
            Some(_) => (),
            None=>return Err(Errors::MissionNotFound)
        }
    
    if submission.submission_id.is_empty() {
        let id:String=format!("{}_{}",submission.mission_id,user_val.discord_id);

        let new_submission:Submission=Submission{
            mission_id:submission.mission_id,
            submission_id:id,
            user:user_val.discord_id,
            tasks_submitted:submission.tasks_submitted
        };
        
        SUBMISSION_MAP.with(|map| map.borrow_mut().insert(new_submission.submission_id.clone(),new_submission));
        return Ok(());
    }else{
        let old_submission=SUBMISSION_MAP.with(|map| map.borrow().get(&submission.submission_id));
        match old_submission {
            Some(mut value) => {
                value.tasks_submitted=submission.tasks_submitted;
                let updated=SUBMISSION_MAP.with(|map| map.borrow_mut().insert(submission.submission_id, value));
                match updated{
                    Some(_) => return Ok(()),
                    None => return Err(Errors::ErrUpdatingSubmission) 
                }
            },
            None => return Err(Errors::NoSubmissionFound)
        }
    }
}

#[query]
pub fn get_submission(id:String)->Result<Submission,Errors>{
    let submission=SUBMISSION_MAP.with(|map| map.borrow().get(&id));

    match submission {
        Some(val)=>return Ok(val),
        None=>return Err(Errors::NoSubmissionFound)
    }
}

#[update]
pub fn approve_submission(id:String)->Result<String,String>{
    let submission=SUBMISSION_MAP.with(|map| map.borrow().get(&id.clone()));
    return Ok("still in development".to_string()); 
}
