use super::{check_editor, lock_funds, unlock_funds};
use crate::{
    check_anonymous, Errors, Mission, MissionStatus, RewardCurrency, Space, SubmissionStatus,
    MISSION_MAP, SPACE_MAP, SUBMISSION_MAP,
};
use ic_cdk::{caller, query, update};

// func to create mission in a space (currently not used)
// #[update(guard = check_anonymous)]
// pub fn create_mission(mission:CreateMission)->Result<(),String>{
//     let space=SPACE_MAP.with(|map| map.borrow().get(&mission.space_id));
//     let mut space_val:Space;
//     match space {
//         Some(value) => {
//             if value.owner!=caller() {
//                 return Err(String::from("Not owner or super admin"));
//             }
//             space_val=value;
//         },
//         None => return Err(String::from("No space found with this id"))
//     }
//     let id=format!("{}_{}",mission.space_id,space_val.mission_count);
//     space_val.mission_count+=1;
//     let lock_fund_res=lock_funds(space_val.space_id.clone(), mission.pool);
//     match lock_fund_res {
//         Ok(_)=>{},
//         Err(e)=>return Err(e)
//     }
//     let new_mission:Mission=Mission{
//         mission_id:id,
//         space_id:mission.space_id,
//         description:mission.description,
//         start_date:mission.start_date,
//         end_date:mission.end_date,
//         owner:caller(),
//         title:mission.title,
//         status:mission.status,
//         reward:mission.reward,
//         reward_currency:mission.reward_currency,
//         img:None,
//         tasks:vec![],
//         max_users_rewarded:mission.max_users_rewarded,
//         pool:mission.pool,
//         expiry_date: mission.expiry_date
//     };
//     let updated=SPACE_MAP.with(|map| map.borrow_mut().insert(space_val.space_id.clone(), space_val));
//     match updated {
//         Some(_) => {
//             MISSION_MAP.with(|map| map.borrow_mut().insert(new_mission.mission_id.clone(), new_mission));
//             return Ok(())
//         },
//         None => return Err(String::from("Err updating the mission count"))
//     }
// }

// Access Control : Editor
#[update(guard = check_anonymous)]
pub fn create_draft_mission(space_id: String) -> Result<(), Errors> {
    let space = SPACE_MAP.with(|map| map.borrow().get(&space_id));
    let mut space_val: Space;

    match space {
        Some(value) => {
            if !check_editor(caller(), space_id.clone()).is_ok() {
                return Err(Errors::NotAuthorized);
            }
            space_val = value;
        }
        none => return Err(Errors::NoSpaceFound),
    }

    let id = format!("{}_{}", space_id, space_val.mission_count);
    space_val.mission_count += 1;

    let new_mission: Mission = Mission {
        mission_id: id,
        space_id: space_id,
        description: String::from(""),
        start_date: String::from(""),
        end_date: String::from(""),
        owner: caller(),
        title: String::from("Draft Mission"),
        status: MissionStatus::Draft,
        reward: 0,
        reward_currency: RewardCurrency::ICP,
        img: None,
        tasks: vec![],
        max_users_rewarded: 0,
        total_user_rewarded: 0,
        pool: 0,
        expiry_date: String::from(""),
    };

    let updated = SPACE_MAP.with(|map| {
        map.borrow_mut()
            .insert(space_val.space_id.clone(), space_val)
    });

    match updated {
        Some(_) => {
            MISSION_MAP.with(|map| {
                map.borrow_mut()
                    .insert(new_mission.mission_id.clone(), new_mission)
            });
            return Ok(());
        }
        _none => return Err(Errors::ErrUpdatingMissionCount),
    }
}

// Access Control : Editor
#[update(guard = check_anonymous)]
pub fn edit_mission(mission: Mission) -> Result<(), String> {
    let space = SPACE_MAP.with(|map| map.borrow().get(&mission.space_id));
    let space_val: Space;
    match space {
        Some(value) => {
            space_val = value;
            if !check_editor(caller(), space_val.space_id.clone()).is_ok() {
                return Err(String::from("Not an owner or super admin"));
            }
        }
        None => return Err(String::from("No space found with this id")),
    };

    let old_mission = MISSION_MAP.with(|map| map.borrow().get(&mission.mission_id));

    match old_mission {
        Some(val) => {
            if val.pool > mission.pool {
                let lock_fund_res =
                    unlock_funds(space_val.space_id.clone(), val.pool - mission.pool);
                match lock_fund_res {
                    Ok(_) => {}
                    Err(e) => return Err(e),
                }
            };
            if val.pool < mission.pool {
                let lock_fund_res = lock_funds(space_val.space_id.clone(), mission.pool - val.pool);
                match lock_fund_res {
                    Ok(_) => {}
                    Err(e) => return Err(e),
                }
            }
        }
        None => return Err(String::from("No mission found with this id")),
    }

    let updated =
        MISSION_MAP.with(|map| map.borrow_mut().insert(mission.mission_id.clone(), mission));

    match updated {
        Some(_) => return Ok(()),
        None => return Err(String::from("Error updating the mission")),
    };
}

// Access Control : Open
#[query]
pub fn get_all_space_missions(space_id: String) -> Result<Vec<Mission>, Errors> {
    let space = SPACE_MAP.with(|map| map.borrow().get(&space_id));
    let space_val: Space;

    match space {
        Some(value) => space_val = value,
        None => return Err(Errors::NoSpaceFound),
    }

    // Instead of looping through all possible IDs, we'll filter all missions directly
    let all_missions = MISSION_MAP.with(|map| {
        let borrowed_map = map.borrow();
        borrowed_map
            .iter()
            .filter(|(id, _)| id.starts_with(&format!("{}_", space_id)))
            .map(|(_, mission)| mission)
            .collect::<Vec<Mission>>()
    });

    Ok(all_missions)
}

#[update]
pub fn delete_mission(mission_id: String) -> Result<(), Errors> {
    let mission = MISSION_MAP.with(|map| map.borrow().get(&mission_id));

    match mission {
        Some(mission) => {
            // Check if caller is editor
            // if !check_editor(caller(), mission.space_id.clone()).is_ok() {
            //     return Err(Errors::NotAuthorized);
            // }

            // Get current timestamp in milliseconds (convert from nanoseconds)
            let current_time_ms = ic_cdk::api::time() / 1_000_000;

            // Parse end_date as milliseconds since epoch
            let end_timestamp = match mission.end_date.parse::<u64>() {
                Ok(ts) => ts,
                Err(_) => return Err(Errors::InvalidExpiryDate),
            };

            // Check if mission hasn't expired yet
            if current_time_ms < end_timestamp {
                return Err(Errors::MissionNotExpired);
            }

            // For missions with max_users_rewarded > 0, check submissions
            if mission.max_users_rewarded > 0 {
                // Check for unread submissions
                let has_unread_submissions = SUBMISSION_MAP.with(|map| {
                    map.borrow().iter().any(|(_, submission)| {
                        submission.mission_id == mission_id
                            && submission.status == SubmissionStatus::Unread
                    })
                });

                if has_unread_submissions {
                    return Err(Errors::UnreadSubmissionsExist);
                }
            }

            // If there's still locked funds, unlock them before deletion
            if mission.pool > 0 {
                match unlock_funds(mission.space_id.clone(), mission.pool) {
                    Ok(_) => {}
                    Err(_) => return Err(Errors::FailedToUnlockFunds),
                }
            }

            // Remove mission from map
            MISSION_MAP.with(|map| map.borrow_mut().remove(&mission_id));
            Ok(())
        }
        None => Err(Errors::NoMissionFound),
    }
}
