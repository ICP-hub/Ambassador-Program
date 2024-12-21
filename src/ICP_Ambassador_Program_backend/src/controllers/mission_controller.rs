use ic_cdk::{caller, query, update};

use crate::{check_anonymous, CreateMission, Errors, FundEntry, Mission, MissionStatus, RewardCurrency, Space, MISSION_MAP, SPACE_FUND_MAP, SPACE_MAP};

use super::{is_super_admin, lock_funds, unlock_funds};

#[update(guard = check_anonymous)]
pub fn create_mission(mission:CreateMission)->Result<(),String>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&mission.space_id));
    let mut space_val:Space;

    match space {
        Some(value) => {
            if value.owner!=caller() && !is_super_admin(caller()) {
                return Err(String::from("Not owner or super admin"));
            }
            space_val=value;
        },
        None => return Err(String::from("No space found with this id"))
    }

    let id=format!("{}_{}",mission.space_id,space_val.mission_count);
    space_val.mission_count+=1;
    let lock_fund_res=lock_funds(space_val.space_id.clone(), mission.pool);
    match lock_fund_res {
        Ok(_)=>{},
        Err(e)=>return Err(e)
    }

    let new_mission:Mission=Mission{
        mission_id:id,
        space_id:mission.space_id,
        description:mission.description,
        start_date:mission.start_date,
        end_date:mission.end_date,
        owner:caller(),
        title:mission.title,
        status:mission.status,
        reward:mission.reward,
        reward_currency:mission.reward_currency,
        img:None,
        tasks:vec![],
        max_users_rewarded:mission.max_users_rewarded,
        pool:mission.pool
    };

    let updated=SPACE_MAP.with(|map| map.borrow_mut().insert(space_val.space_id.clone(), space_val));

    match updated {
        Some(_) => {
            MISSION_MAP.with(|map| map.borrow_mut().insert(new_mission.mission_id.clone(), new_mission));
            return Ok(())
        },
        None => return Err(String::from("Err updating the mission count"))
    }

    
}

#[update(guard = check_anonymous)]
pub fn create_draft_mission(space_id:String)->Result<(),Errors>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&space_id));
    let mut space_val:Space;

    match space {
        Some(value) => {
            if value.owner!=caller() && !is_super_admin(caller()) {
                return Err(Errors::NotOwnerOrSuperAdmin);
            }
            space_val=value;
        },
        None => return Err(Errors::NoSpaceFound)
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
        title:String::from("draft mission"),
        status:MissionStatus::Draft,
        reward:0,
        reward_currency:RewardCurrency::ICP,
        img:None,
        tasks:vec![],
        max_users_rewarded:0,
        pool:0
    };

    let updated=SPACE_MAP.with(|map| map.borrow_mut().insert(space_val.space_id.clone(), space_val));

    match updated {
        Some(_) => {
            MISSION_MAP.with(|map| map.borrow_mut().insert(new_mission.mission_id.clone(), new_mission));
            return Ok(())
        },
        None => return Err(Errors::ErrUpdatingMissionCount)
    }

    
}

#[update(guard = check_anonymous)]
pub fn edit_mission(mission:Mission)->Result<(),String>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&mission.space_id));
    let space_val:Space;
    match space {
        Some(value) => {
            space_val=value;
            if space_val.owner!=caller() && !is_super_admin(caller()) {
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

#[query]
pub fn get_all_space_missions(space_id:String)->Result<Vec<Mission>,Errors>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&space_id));
    let space_val:Space;

    match space {
        Some(value) => {
            // commented this as unauthenticated users on client side also need to see this
            
            // if value.owner!=caller() && !is_super_admin(caller()) {
            //     return Err(Errors::NotOwnerOrSuperAdmin);
            // }
            space_val=value;
        },
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

#[query]
pub fn get_mission(mission_id:String)-> Result<Mission,Errors>{
    let mission=MISSION_MAP.with(|map| map.borrow().get(&mission_id));
    match mission {
        Some(value) => return Ok(value),
        None => return Err(Errors::MissionNotFound)
    }
}
// pub fn get_all_active_missions(){

// }
// pub fn get_all_inactive_missions(){

// }

