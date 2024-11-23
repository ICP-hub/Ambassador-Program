use ic_cdk::{query, update};

use crate::{Errors, Submission, SubmissionArr, SubmissionStatus, UserProfile, MISSION_MAP, MISSION_TO_SUBMISSION_MAP, SUBMISSION_MAP, USER_PROFILE_MAP};

use super::user_controller;

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
            tasks_submitted:submission.tasks_submitted,
            status:SubmissionStatus::Unread
        };

        let prev_submissions=MISSION_TO_SUBMISSION_MAP.with(|map| map.borrow().get(&new_submission.mission_id));
        let mut prev_sub_val:Vec<String>;

        match prev_submissions{
            Some(val)=>prev_sub_val=val.submissions,
            None=>prev_sub_val=vec![]
        }

        prev_sub_val.push(new_submission.submission_id.clone());

        let sub_arr:SubmissionArr=SubmissionArr{
            mission:new_submission.mission_id.clone(),
            submissions:prev_sub_val
        };

        MISSION_TO_SUBMISSION_MAP.with(|map| map.borrow_mut().insert(new_submission.mission_id.clone(), sub_arr));
        
        SUBMISSION_MAP.with(|map| map.borrow_mut().insert(new_submission.submission_id.clone(),new_submission));
        return Ok(());
    }else{
        let old_submission=SUBMISSION_MAP.with(|map| map.borrow().get(&submission.submission_id));
        match old_submission {
            Some(mut value) => {
                if value.status == SubmissionStatus::Approved || value.status==SubmissionStatus::Rejected{
                    return Err(Errors::SubmissionAlreadyReviewed)
                }
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

#[query]
pub fn get_all_mission_submissions(id:String)->Option<SubmissionArr>{
    return MISSION_TO_SUBMISSION_MAP.with(|map| map.borrow().get(&id));
}

#[update]
pub fn approve_submission(id:String)->Result<String,String>{
    let old_submission=SUBMISSION_MAP.with(|map| map.borrow().get(&id.clone()));
    let mut new_submission:Submission;
    match old_submission{
        Some(val)=>new_submission=val,
        None=>return Err("no submission found with this id".to_string())
    }
    let mission=MISSION_MAP.with(|map| map.borrow().get(&new_submission.mission_id.clone()));
    match mission{
        Some(val)=>{
            let res=user_controller::update_points(new_submission.user.clone(), val.reward);
            match res{
                Err(e)=>return Err(e),
                Ok(_)=>{}
            }
        },
        None=>return Err("mission for this submission does not exists".to_string())
    }
    new_submission.status=SubmissionStatus::Approved;
    SUBMISSION_MAP.with(|map| map.borrow_mut().insert(new_submission.submission_id.clone(), new_submission));
    return Ok("still in development".to_string()); 
}

#[update]
pub fn reject_submission(id:String)->Result<String,String>{
    let old_submission=SUBMISSION_MAP.with(|map| map.borrow().get(&id.clone()));
    let mut new_submission:Submission;
    match old_submission{
        Some(val)=>new_submission=val,
        None=>return Err("no submission found with this id".to_string())
    }
    new_submission.status=SubmissionStatus::Rejected;
    SUBMISSION_MAP.with(|map| map.borrow_mut().insert(new_submission.submission_id.clone(), new_submission));
    return Ok("This submission is rejected".to_string());
}
