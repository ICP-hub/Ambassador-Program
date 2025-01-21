use candid::Principal;
use ic_cdk::{caller, query, update};
use crate::{check_anonymous, Space, SPACE_MAP, };
use super::assign_admin_space;
use super::Role;

// Access Control : Owner/Admin
#[update(guard = check_anonymous)]
pub fn add_role_to_space(space_id: String, user_principal: Principal, role: Role) -> Result<(), String> {
    let caller = caller();

    // Ensure only the owner of the space can add moderators or editors
    let mut space = get_space_by_id(space_id.clone())?;
    if space.owner != caller {
        return Err("Only the owner of the space can add moderators or editors".to_string());
    }

    // add space to the user's admin spaces
    let _ = assign_admin_space(user_principal, space_id.clone());

    match role {
        Role::Moderator => {
            // Add the user to the moderators list
            if !space.moderators.contains(&user_principal) {
                space.moderators.push(user_principal);
            }
        },
        Role::Editor => {
            // Add the user to the editors list
            if !space.editors.contains(&user_principal) {
                space.editors.push(user_principal);
            }
        },
    }

    SPACE_MAP.with(|map| map.borrow_mut().insert(space_id.clone(), space));

    Ok(())
}

#[query]
pub fn get_space_by_id(space_id: String) -> Result<Space, String> {
    let space = SPACE_MAP.with(|map| map.borrow().get(&space_id));

    match space {
        Some(value) => Ok(value),
        None => Err("No space found".to_string())
    }
}

pub fn check_moderator(principal: Principal , space_id: String) -> Result<(), String> {
    let space = get_space_by_id(space_id)?;

    if space.owner == principal {
        return Ok(());
    }

    if space.moderators.contains(&principal){
        return Ok(());
    }

    Err("Only Admins and Moderators can perform this action".to_string())
}

pub fn check_editor(principal: Principal , space_id: String) -> Result<(), String> {
 
    let space = get_space_by_id(space_id)?;

    if space.owner == principal {
        return Ok(());
    }

    if space.editors.contains(&principal){
        return Ok(());
    }

    Err("Only Admins and Editors can perform this action".to_string())
}
