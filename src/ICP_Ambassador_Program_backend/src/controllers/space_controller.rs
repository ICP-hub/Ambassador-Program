use ic_cdk::caller;
use uuid::Uuid;

use crate::{AdminErrors, CreateSpace, Space, SpaceURLs, ADMIN_MAP, SPACE_MAP};

#[ic_cdk::update]
pub fn create_space(space:CreateSpace)->Result<Option<Space>,AdminErrors>{
    let admin=ADMIN_MAP.with(|map| map.borrow().get(&caller()));

    match admin {
        Some(_) => (),
        None => return Err(AdminErrors::NotRegisteredAsAdmin)
    };

    let id=Uuid::new_v4().to_string();

    let new_space:Space=Space{
        space_id:id,
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
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&caller()));

    match admin {
        Some(_) => (),
        None => return Err(AdminErrors::NotRegisteredAsAdmin)
    };

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
    let space = SPACE_MAP.with(|map| map.borrow().get(&space_id));

    match space {
        Some(value) => return Ok(value),
        None => return Err(AdminErrors::NoSpaceFound)
    }
}