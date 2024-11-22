use ic_cdk::{caller, query, update};

use crate::{check_anonymous, Errors, CreateMission, Mission, MissionStatus, RewardCurrency, Space, MISSION_MAP, SPACE_MAP};

use super::is_super_admin;

#[update(guard = check_anonymous)]
pub fn create_mission(mission:CreateMission)->Result<(),Errors>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&mission.space_id));
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

    let id=format!("{}_{}",mission.space_id,space_val.mission_count);
    space_val.mission_count+=1;

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
        tasks:vec![]
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
        tasks:vec![]
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
pub fn edit_mission(mission:Mission)->Result<(),Errors>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&mission.space_id));

    match space {
        Some(value) => {
            if value.owner!=caller() && !is_super_admin(caller()) {
                return Err(Errors::NotOwnerOrSuperAdmin);
            }
        },
        None => return Err(Errors::NoSpaceFound)
    };

    let old_mission=MISSION_MAP.with(|map| map.borrow().get(&mission.mission_id));

    if old_mission.is_none(){
        return Err(Errors::MissionNotFound)
    }
    
    let updated=MISSION_MAP.with(|map| map.borrow_mut().insert(mission.mission_id.clone(), mission));

    match updated {
        Some(_) => return Ok(()),
        None => return Err(Errors::ErrUpdatingMission)
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

