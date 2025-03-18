use ic_cdk::{caller, query, update};
use crate::{check_anonymous, Errors, Mission, MissionStatus, RewardCurrency, Space, MISSION_MAP, SPACE_MAP};
use super::{check_editor, lock_funds, unlock_funds};

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
pub fn create_draft_mission(space_id:String)->Result<(),Errors>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&space_id));
    let mut space_val:Space;

    match space {
        Some(value) => {
            if !check_editor(caller(), space_id.clone()).is_ok(){
                return Err(Errors::NotAuthorized);
            }
            space_val=value;
        },
        none => return Err(Errors::NoSpaceFound)
    }

    let id=format!("{}_{}",space_id,space_val.mission_count);
    space_val.mission_count+=1;

    let new_mission:Mission=Mission{
        mission_id:id,
        space_id:space_id,
        description:String::from(""),
        start_date:String::from(""),
        end_date:String::from(""),
        owner:caller(),
        title:String::from("Draft Mission"),
        status:MissionStatus::Draft,
        reward:0,
        reward_currency:RewardCurrency::ICP,
        img:None,
        tasks:vec![],
        max_users_rewarded:0,
        total_user_rewarded:0,
        pool:0,
        expiry_date: String::from("")
    };

    let updated=SPACE_MAP.with(|map| map.borrow_mut().insert(space_val.space_id.clone(), space_val));

    match updated {
        Some(_) => {
            MISSION_MAP.with(|map| map.borrow_mut().insert(new_mission.mission_id.clone(), new_mission));
            return Ok(())
        },
        _none => return Err(Errors::ErrUpdatingMissionCount)
    }

    
}

// Access Control : Editor
#[update(guard = check_anonymous)]
pub fn edit_mission(mission:Mission)->Result<(),String>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&mission.space_id));
    let space_val:Space;
    match space {
        Some(value) => {
            space_val=value;
            if !check_editor(caller(), space_val.space_id.clone()).is_ok(){
                return Err(String::from("Not an owner or super admin"));
            }            
        },
        None => return Err(String::from("No space found with this id"))
    };

    let old_mission=MISSION_MAP.with(|map| map.borrow().get(&mission.mission_id));

    match old_mission {
        Some(val)=>{
            if val.pool>mission.pool{
                let lock_fund_res=unlock_funds(space_val.space_id.clone(), val.pool-mission.pool);
                match lock_fund_res {
                    Ok(_)=>{},
                    Err(e)=>return Err(e)
                }
            };
            if val.pool<mission.pool{
                let lock_fund_res=lock_funds(space_val.space_id.clone(), mission.pool-val.pool);
                match lock_fund_res {
                    Ok(_)=>{},
                    Err(e)=>return Err(e)
                }
            }
        },
        None=>{
            return Err(String::from("No mission found with this id"))
        }
    }
    
    let updated=MISSION_MAP.with(|map| map.borrow_mut().insert(mission.mission_id.clone(), mission));

    match updated {
        Some(_) => return Ok(()),
        None => return Err(String::from("Error updating the mission"))
    };
}

// Access Control : Open
#[query]
pub fn get_all_space_missions(space_id:String)->Result<Vec<Mission>,Errors>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&space_id));
    let space_val:Space;

    match space {
        Some(value) => space_val=value,
        None => return Err(Errors::NoSpaceFound)
    }

    let mut count=0;
    let mut mission_list:Vec<Mission>=vec!();

    loop{
        if count>=space_val.mission_count{
            break;
        }
        let id=format!("{}_{}",space_id,count);

        let mission=MISSION_MAP.with(|map| map.borrow().get(&id));

        match mission {
            Some(value) => mission_list.push(value),
            None => continue
        }
        
        count+=1;
    }
    return Ok(mission_list)
}


#[update(guard = check_anonymous)]
pub fn delete_mission(mission_id: String) -> Result<(), Errors> {
    let mission = MISSION_MAP.with(|map| map.borrow().get(&mission_id));
    
    match mission {
        Some(mission) => {
            // Check if caller is editor
            if !check_editor(caller(), mission.space_id.clone()).is_ok() {
                return Err(Errors::NotAuthorized);
            }

            // If mission had locked funds, unlock them
            if mission.pool > 0 {
                let unlock_result = unlock_funds(mission.space_id.clone(), mission.pool);
                if let Err(e) = unlock_result {
                    return Err(Errors::FailedToUnlockFunds);
                }
            }

            // Remove mission from map
            MISSION_MAP.with(|map| map.borrow_mut().remove(&mission_id));
            Ok(())
        },
        None => Err(Errors::NoMissionFound)
    }
}
