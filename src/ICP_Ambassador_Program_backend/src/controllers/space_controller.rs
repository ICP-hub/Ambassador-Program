use candid::Principal;
use ic_cdk::{caller,query,update};
// use uuid::Uuid;

use crate::{Admin, Errors, CreateSpace, Space, SpaceURLs, ADMIN_MAP, SPACE_MAP,check_anonymous};

use super::{is_super_admin, is_valid_admin};

#[update(guard = check_anonymous)]
pub fn create_space(space:CreateSpace)->Result<Option<Space>,Errors>{

    if !is_valid_admin(caller()){
        return Err(Errors::NotRegisteredAsAdmin)
    }

    let id=update_admin_spaces(caller());
    let space_id:String;

    match id {
        Ok(value) => space_id=value,
        Err(value) => return Err(value)
    }


    let new_space:Space=Space{
        space_id,
        name:space.name,
        slug:space.slug,
        description:space.description,
        owner:caller(),
        chain:space.chain,
        logo:None,
        bg_css:None,
        shor_description:None,
        bg_img:None,
        urls:SpaceURLs{
            telegram:None,
            website:None,
            medium:None,
            twitter:None,
            discord:None,
            github:None
        },
        mission_count:0
    };

    let inserted=SPACE_MAP.with(|map| map.borrow_mut().insert(new_space.space_id.clone(), new_space));
    return Ok(inserted);
}

#[update(guard = check_anonymous)]
pub fn update_space(updated_space:Space)->Result<(),Errors>{

    if !is_valid_admin(caller()){
        return Err(Errors::NotRegisteredAsAdmin)
    }

    let old_space=SPACE_MAP.with(|map| map.borrow().get(&updated_space.space_id));

    match old_space {
        Some(value) => {
            if value.owner != caller() {
                return Err(Errors::NotOwnerOrSuperAdmin)
            };
        },
        None => return Err(Errors::NoSpaceFound)
    };

   

    let updated= SPACE_MAP.with(|map| map.borrow_mut().insert(updated_space.space_id.clone(), updated_space));
    match updated {
        Some(_) => return Ok(()),
        None => return Err(Errors::SpaceUpdateError)
    }


}

// #[query(guard = check_anonymous)]
#[query]
pub fn get_space(space_id:String)->Result<Space,Errors>{

    // if !is_valid_admin(caller()){
    //     return Err(Errors::NotRegisteredAsAdmin)
    // }

    let space = SPACE_MAP.with(|map| map.borrow().get(&space_id));

    match space {
        Some(value) => return Ok(value),
        None => return Err(Errors::NoSpaceFound)
    }
}

#[query(guard = check_anonymous)]
pub fn get_all_admin_spaces()->Result<Vec<String>,Errors>{
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&caller()));
    if admin.is_none(){
        return Err(Errors::NotRegisteredAsAdmin)
    }
    return Ok(admin.unwrap().spaces);
}

// #[query(guard = check_anonymous)]
#[query]
pub fn get_all_spaces()->Result<Vec<(String,Space)>,Errors>{

    // if !is_super_admin(caller()) {
    //     return Err(Errors::NotASuperAdmin)
    // }

    let spaces:Vec<(String,Space)>=SPACE_MAP.with(|map| map.borrow().iter().collect());
    return Ok(Vec::from_iter(spaces));
}

fn update_admin_spaces(id:Principal)->Result<String,Errors>{
    let admin=ADMIN_MAP.with(|map| map.borrow().get(&id));
    let mut new_admin:Admin = admin.unwrap();
    
    let space_id=format!("{}_{}",Principal::to_text(&id),new_admin.spaces.len());
    new_admin.spaces.push(space_id.clone());

    let updated=ADMIN_MAP.with(|map| map.borrow_mut().insert(id, new_admin));

    match updated {
        Some(_) => Ok(space_id),
        None => Err(Errors::NotRegisteredAsAdmin)
    }
}