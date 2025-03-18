use candid::{CandidType, Principal};
use ic_cdk::{caller,update,query};
use serde::{Deserialize, Serialize};

use crate::{Admin, Errors, AdminRole, ADMIN_MAP,check_anonymous};

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub enum Role {
    Moderator,
    Editor,
    SuperAdmin
}

#[update(guard = check_anonymous)]
pub fn register_admin() -> Result<(), Errors> {
    let target_id = caller();
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&target_id));
    if admin.is_some() {
        return Err(Errors::AlreadyAdmin);
    }

    let new_admin: Admin = Admin {
        wallet_id: target_id,
        role: AdminRole::HubLeader,
        spaces: vec![],
    };
    ADMIN_MAP.with(|map| map.borrow_mut().insert(target_id, new_admin));
    
    Ok(())
}

#[query(guard = check_anonymous)]
pub fn get_admin()->Result<Admin,Errors>{
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&caller()));
    
    match admin{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsAdmin)
    }
}

pub fn is_valid_admin(caller:Principal)->bool{
    let admin=ADMIN_MAP.with(|map| map.borrow().get(&caller));

    if admin.is_none(){
        return false
    }
    return true;
}