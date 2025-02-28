use ic_cdk::{caller, query, update};
use ic_cdk::api::time;
use crate::state::{Reward, RewardHistory, REWARD_HISTORY_MAP};
use crate::{Errors, Submission, SubmissionArr, SubmissionStatus,LeaderboardEntry,SPACE_MAP, TaskSubmitted, UserProfile, MISSION_MAP, MISSION_TO_SUBMISSION_MAP, SUBMISSION_MAP, USER_PROFILE_MAP};

use super::{check_editor, user_controller};

// Access Control : User/Open
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
                    let mut task_already_exists:bool=false;
                    let task_id:u8;
                    match task.clone()
                    {
                        TaskSubmitted::SendText { id, text:_ }=>{
                         task_id=id
                        },
                        TaskSubmitted::SendTwitterPost { id, post:_ }=>{
                         task_id=id
                        },
                        TaskSubmitted::SendUrl { id, url:_ }=>{
                         task_id=id
                        },
                        TaskSubmitted::TwitterFollow { id, followed:_ }=>{
                         task_id=id
                        },
                        TaskSubmitted::SendImage { id, img:_ }=>{
                         task_id=id
                        }
                    }
                    for i in value.tasks_submitted.iter_mut(){
                        match i{
                            TaskSubmitted::SendText { id, text:_ }=>{
                                if *id==task_id{
                                 task_already_exists=true
                                }
                            },
                            TaskSubmitted::SendTwitterPost { id, post:_ }=>{
                                if *id==task_id{
                                 task_already_exists=true
                                }
                            },
                            TaskSubmitted::SendUrl { id, url:_ }=>{
                                if *id==task_id{
                                 task_already_exists=true
                                }
                            },
                            TaskSubmitted::TwitterFollow { id, followed:_ }=>{
                                if *id==task_id{
                                 task_already_exists=true
                                }
                            },
                            TaskSubmitted::SendImage { id, img:_ }=>{
                                if *id==task_id{
                                 task_already_exists=true
                                }
                            }
                        }
                    }
                    if task_already_exists{
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

// Access Control : User/Open
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

// Access Control : User/Open
#[query]
pub fn get_submission(id:String)->Result<Submission,Errors>{
    let submission=SUBMISSION_MAP.with(|map| map.borrow().get(&id));

    match submission {
        Some(val)=>return Ok(val),
        None=>return Err(Errors::NoSubmissionFound)
    }
}

// Access Control : User/Open
#[query]
pub fn get_all_mission_submissions(id:String)->Option<SubmissionArr>{
    return MISSION_TO_SUBMISSION_MAP.with(|map| map.borrow().get(&id));
}

// Access Control : Editor
#[update]
pub fn approve_submission(id: String) -> Result<String, String> {
    // First get the submission
    let submission = SUBMISSION_MAP.with(|map| map.borrow().get(&id));
    
    let submission = match submission {
        Some(sub) => {
            if sub.status == SubmissionStatus::Approved {
                return Err("Submission is already approved".to_string());
            }
            if sub.status == SubmissionStatus::Rejected {
                return Err("Cannot approve a rejected submission".to_string());
            }
            sub
        },
        None => return Err("No submission found with this id".to_string())
    };

    // Get the mission to get the space_id
    let mission = MISSION_MAP.with(|map| map.borrow().get(&submission.mission_id));
    let mission = match mission {
        Some(m) => m,
        None => return Err("Mission not found".to_string())
    };

    // Check editor permissions with the correct space_id
    if !check_editor(caller(), mission.space_id.clone()).is_ok() {
        return Err("Only the editor of the space can approve submissions".to_string());
    }

    // Update submission status and points
    let mut updated_submission = submission.clone();
    if mission.max_users_rewarded > 0 && !updated_submission.points_rewarded {
        match user_controller::update_points(updated_submission.user.clone(), mission.reward) {
            Ok(_) => {
                updated_submission.points_rewarded = true;
                let mut updated_mission = mission.clone();
                updated_mission.max_users_rewarded -= 1;
                MISSION_MAP.with(|map| map.borrow_mut().insert(updated_mission.mission_id.clone(), updated_mission));
            },
            Err(e) => return Err(format!("Failed to update user points: {}", e))
        }
    }

    // ---- may be we need to moove in above if block------
    
    // Add reward history after successful points update
    if updated_submission.points_rewarded {
        let current_time = time();
        // let current_date = format!("{}", current_time / (24 * 60 * 60 * 1_000_000_000)); // Convert nanoseconds to days
        
        let reward = Reward {
            mission_id: mission.mission_id.clone(),
            mission_title: mission.title.clone(),
            reward: mission.reward,
            date: current_time.to_string(),
        };

        REWARD_HISTORY_MAP.with(|map| {
            let mut map = map.borrow_mut();
            let mut history = map.get(&updated_submission.user)  // user here is discord_id
                .unwrap_or(RewardHistory {
                    user: updated_submission.user.clone(),  // this is discord_id
                    rewards: vec![]
                });
            
            history.rewards.push(reward);
            map.insert(updated_submission.user.clone(), history);  // user here is discord_id
        });
    }

    updated_submission.status = SubmissionStatus::Approved;
    SUBMISSION_MAP.with(|map| map.borrow_mut().insert(updated_submission.submission_id.clone(), updated_submission));
    
    Ok("Submission successfully approved".to_string())
}
// Access Control : Editor
#[update]
pub fn reject_submission(id: String) -> Result<String, String> {
    let space_id = extract_space_id(&id);

    ic_cdk::print(&format!("extracted space {}", space_id.clone()));

    let caller = caller();
    
    if !check_editor(caller, space_id.clone()).is_ok() {
        return Err("Only the editor of the space can reject submissions".to_string());
    }

    let submission = SUBMISSION_MAP.with(|map| map.borrow().get(&id));
    
    let mut submission = match submission {
        Some(sub) => {
            if sub.status == SubmissionStatus::Approved {
                return Err("Cannot reject an approved submission".to_string());
            }
            if sub.status == SubmissionStatus::Rejected {
                return Err("Submission is already rejected".to_string());
            }
            sub
        },
        None => return Err("No submission found with this id".to_string())
    };

    submission.status = SubmissionStatus::Rejected;
    SUBMISSION_MAP.with(|map| map.borrow_mut().insert(submission.submission_id.clone(), submission));
    
    Ok("Submission successfully rejected".to_string())
}

// pub fn extract_space_id(mission_id: &str) -> String {
//     match mission_id.rsplit_once('_') {
//         Some((space_id, _)) => space_id.to_string(),
//         None => mission_id.to_string(),
//     }
// }
pub fn extract_space_id(mission_id: &str) -> String {
    let parts: Vec<&str> = mission_id.split('_').collect();
    if parts.len() == 4 && parts[1].len() == 1 && parts[1].chars().all(char::is_numeric) {
        format!("{}_{}", parts[0], parts[1])
    } else {
        mission_id.to_string()
    }
}

#[query]
pub fn get_user_reward_history(discord_id: String) -> Result<RewardHistory, String> {
    // Validate input
    if discord_id.is_empty() {
        return Err("Discord ID cannot be empty".to_string());
    }

    // Get reward history from map
    match REWARD_HISTORY_MAP.with(|map| map.borrow().get(&discord_id)) {
        Some(history) => Ok(history),
        None => Ok(RewardHistory {
            user: discord_id,
            rewards: vec![]
        })
    }
}

// create leaderboard for user by hubs
#[query]
pub fn get_leaderboard(hub: String) -> Result<Vec<LeaderboardEntry>, String> {
    // check if the hub exists
    let hub_exists = SPACE_MAP.with(|map| map.borrow().contains_key(&hub));
    if !hub_exists {
        return Err("Hub does not exist".to_string());
    }

    let mut leaderboard: Vec<LeaderboardEntry> = vec![];
    
    USER_PROFILE_MAP.with(|map| {
        let borrowed_map = map.borrow();
        for (_, user) in borrowed_map.iter() {
            if user.hub == hub {
                leaderboard.push(LeaderboardEntry {
                    name: user.username.clone(),
                    rank: user.level.to_string(),
                    points: user.xp_points,
                });
            }
        }
    });

    leaderboard.sort_by(|a, b| b.points.cmp(&a.points));
    Ok(leaderboard)
}
