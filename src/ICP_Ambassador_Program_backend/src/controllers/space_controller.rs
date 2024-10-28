use candid::Principal;
use ic_cdk::caller;
// use uuid::Uuid;

use crate::{Admin, AdminErrors, CreateSpace, Space, SpaceURLs, ADMIN_MAP, SPACE_MAP};

use super::{is_super_admin, is_valid_admin};

#[ic_cdk::update]
pub fn create_space(space:CreateSpace)->Result<Option<Space>,AdminErrors>{

    if !is_valid_admin(caller()){
        return Err(AdminErrors::NotRegisteredAsAdmin)
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
        }
    };

    let inserted=SPACE_MAP.with(|map| map.borrow_mut().insert(new_space.space_id.clone(), new_space));
    return Ok(inserted);
}

#[ic_cdk::update]
pub fn update_space(updated_space:Space)->Result<(),AdminErrors>{

    if !is_valid_admin(caller()){
        return Err(AdminErrors::NotRegisteredAsAdmin)
    }

    let old_space=SPACE_MAP.with(|map| map.borrow().get(&updated_space.space_id));

    match old_space {
        Some(value) => {
            if value.owner != caller() {
                return Err(AdminErrors::NotOwnerOrSuperAdmin)
            };
        },
        None => return Err(AdminErrors::NoSpaceFound)
    };

   

    let updated= SPACE_MAP.with(|map| map.borrow_mut().insert(updated_space.space_id.clone(), updated_space));
    match updated {
        Some(_) => return Ok(()),
        None => return Err(AdminErrors::SpaceUpdateError)
    }


}

#[ic_cdk::query]
pub fn get_space(space_id:String)->Result<Space,AdminErrors>{

    if !is_valid_admin(caller()){
        return Err(AdminErrors::NotRegisteredAsAdmin)
    }

    let space = SPACE_MAP.with(|map| map.borrow().get(&space_id));

    match space {
        Some(value) => return Ok(value),
        None => return Err(AdminErrors::NoSpaceFound)
    }
}

#[ic_cdk::query]
pub fn get_all_admin_spaces()->Result<Vec<String>,AdminErrors>{
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&caller()));
    if admin.is_none(){
        return Err(AdminErrors::NotRegisteredAsAdmin)
    }
    return Ok(admin.unwrap().spaces);
}

#[ic_cdk::query]
pub fn get_all_spaces()->Result<Vec<(String,Space)>,AdminErrors>{

    if !is_super_admin(caller()) {
        return Err(AdminErrors::NotASuperAdmin)
    }

    let spaces:Vec<(String,Space)>=SPACE_MAP.with(|map| map.borrow().iter().collect());
    return Ok(Vec::from_iter(spaces));
}

fn update_admin_spaces(id:Principal)->Result<String,AdminErrors>{
    let admin=ADMIN_MAP.with(|map| map.borrow().get(&id));
    let mut new_admin:Admin = admin.unwrap();
    
    let space_id=format!("{}_{}",Principal::to_text(&id),new_admin.spaces.len());
    new_admin.spaces.push(space_id.clone());

    let updated=ADMIN_MAP.with(|map| map.borrow_mut().insert(id, new_admin));

    match updated {
        Some(_) => Ok(space_id),
        None => Err(AdminErrors::NotRegisteredAsAdmin)
    }
}