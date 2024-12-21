use ic_cdk::{query, update};

use crate::{Errors, Submission, SubmissionArr, SubmissionStatus, TaskSubmitted, UserProfile, MISSION_MAP, MISSION_TO_SUBMISSION_MAP, SUBMISSION_MAP, USER_PROFILE_MAP};

use super::user_controller;

#[update]
pub fn add_task_submission(submission:Submission,task:TaskSubmitted)->Result<String,String>{
    let user=USER_PROFILE_MAP.with(|map| map.borrow().get(&submission.user));
    let user_val:UserProfile;
    match user{
        Some(value) => user_val=value,
        None => return Err(String::from("NO user found with this id"))
    }

    let mission=MISSION_MAP.with(|map| map.borrow().get(&submission.mission_id));
        match mission {
            Some(_) => (),
            None=>return Err(String::from("No mission found for your submission"))
        }
        if submission.submission_id.is_empty() {
            let id:String=format!("{}_{}",submission.mission_id,user_val.discord_id);
    
            let mut new_submission:Submission=Submission{
                mission_id:submission.mission_id,
                submission_id:id,
                user:user_val.discord_id,
                tasks_submitted:vec![],
                status:SubmissionStatus::Unread,
                points_rewarded:false
            };

            new_submission.tasks_submitted.push(task);
    
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
            return Ok(String::from("Task submitted successfully"));
        }else{
            let old_submission=SUBMISSION_MAP.with(|map| map.borrow().get(&submission.submission_id));
            match old_submission {
                Some(mut value) => {
                    if value.status == SubmissionStatus::Approved || value.status==SubmissionStatus::Rejected{
                        return Err(String::from("Submissio already reviwed, cannot submit more tasks"))
                    }
                    let mut taskAlreadyExists:bool=false;

                    let task_id:u8;
                    match task.clone(){
                        TaskSubmitted::SendText { id, text }=>{
                            task_id=id
                        },
                        TaskSubmitted::SendTwitterPost { id, post }=>{
                            task_id=id
                        },
                        TaskSubmitted::SendUrl { id, url }=>{
                            task_id=id
                        },
                        TaskSubmitted::TwitterFollow { id, followed }=>{
                            task_id=id
                        },
                        TaskSubmitted::SendImage { id, img }=>{
                            task_id=id
                        }
                    }
                    
                    for i in value.tasks_submitted.iter_mut(){
                        match i{
                            TaskSubmitted::SendText { id, text }=>{
                                if *id==task_id{
                                    taskAlreadyExists=true
                                }
                            },
                            TaskSubmitted::SendTwitterPost { id, post }=>{
                                if *id==task_id{
                                    taskAlreadyExists=true
                                }
                            },
                            TaskSubmitted::SendUrl { id, url }=>{
                                if *id==task_id{
                                    taskAlreadyExists=true
                                }
                            },
                            TaskSubmitted::TwitterFollow { id, followed }=>{
                                if *id==task_id{
                                    taskAlreadyExists=true
                                }
                            },
                            TaskSubmitted::SendImage { id, img }=>{
                                if *id==task_id{
                                    taskAlreadyExists=true
                                }
                            }
                        }
                    }
                    if taskAlreadyExists{
                        return Err(String::from("Cannot submit a task twice"));
                    }
                    value.tasks_submitted.push(task);
                    let updated=SUBMISSION_MAP.with(|map| map.borrow_mut().insert(submission.submission_id, value));
                    match updated{
                        Some(_) => return Ok(String::from("Task submitted successfully")),
                        None => return Err(String::from("Err updating the task")) 
                    }
                },
                None => return Err(String::from("Cannot find previous submission details"))
            }
        }
}

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
            status:SubmissionStatus::Unread,
            points_rewarded:false
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
