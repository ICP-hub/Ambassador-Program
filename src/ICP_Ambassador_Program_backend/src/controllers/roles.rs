use candid::{Principal, CandidType};
use ic_cdk::{caller, query, update};
use serde::{Serialize, Deserialize};
use crate::{check_anonymous, Space, SPACE_MAP, };
use super::register_admin_by_principal;
use super::Role;

// #[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
// pub enum Role {
//     Moderator,
//     Editor
// }

// function to add a role (Moderator or Editor) to a space
#[update(guard = check_anonymous)]
pub fn add_role_to_space(space_id: String, user_principal: Principal, role: Role) -> Result<(), String> {
    let caller = caller();

    let _ = register_admin_by_principal(user_principal, role.clone());

    // call register_admin function to register new moderators and editors
    // code here

    // Ensure only the owner of the space can add moderators or editors
    let mut space = get_space_by_id(space_id.clone())?;
    if space.owner != caller {
        return Err("Only the owner of the space can add moderators or editors".to_string());
    }

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

    // Update the Moderators and Editors records

    // Update the space in the space map
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

// check if the caller is a moderator or editor of the space

pub fn check_moderator(space_id: String) -> Result<(), String> {
    let caller = caller();
    let space = get_space_by_id(space_id)?;

    if space.owner == caller {
        return Ok(());
    }

    if space.moderators.contains(&caller){
        return Ok(());
    }

    Err("You are not a moderator or editor of this space".to_string())
}

pub fn check_editor(space_id: String) -> Result<(), String> {
    let caller = caller();
    let space = get_space_by_id(space_id)?;

    if space.owner == caller {
        return Ok(());
    }

    if space.editors.contains(&caller){
        return Ok(());
    }

    Err("You are not a moderator or editor of this space".to_string())
}
