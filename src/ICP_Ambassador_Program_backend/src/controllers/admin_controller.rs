use candid::Principal;
use ic_cdk::caller;

use crate::{Admin, AdminErrors, AdminRole, ADMIN_MAP, SUPER_ADMIN,check_anonymous};

#[ic_cdk::update(guard = check_anonymous)]
pub fn register_admin()->Result<(),AdminErrors>{
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&caller()));
    
    if admin.is_some(){
        return Err(AdminErrors::AlreadyAdmin);
    };

    let new_admin:Admin=Admin { 
        wallet_id: caller(),
        role:AdminRole::HubLeader,
        spaces:vec![]  
    };

    ADMIN_MAP.with(|map| map.borrow_mut().insert(caller(), new_admin));
    return Ok(());
}

#[ic_cdk::update(guard = check_anonymous)]
pub fn add_admin_by_super_admin(id:Principal)->Result<(),AdminErrors>{

    if !is_super_admin(caller()) {
        return Err(AdminErrors::NotASuperAdmin)
    }

    let admin = ADMIN_MAP.with(|map| map.borrow().get(&id));
    
    if admin.is_some(){
        return Err(AdminErrors::AlreadyAdmin);
    };

    let new_admin:Admin=Admin { 
        wallet_id: id,
        role:AdminRole::HubLeader,
        spaces:vec![]    
    };

    ADMIN_MAP.with(|map| map.borrow_mut().insert(id, new_admin));
    return Ok(());
}

#[ic_cdk::update(guard = check_anonymous)]
pub fn promote_to_super_admin(id:Principal)->Result<(), AdminErrors>{

    if !is_super_admin(caller()) {
        return Err(AdminErrors::NotASuperAdmin)
    }

    let admin = ADMIN_MAP.with(|map| map.borrow().get(&id));
    let old_admin:Admin;

    match admin {
        Some(value) => old_admin=value,
        None => return Err(AdminErrors::NotRegisteredAsAdmin)
    }

    let super_admins=SUPER_ADMIN.with(|map| map.borrow().iter().any(|el| el==id));
    if super_admins{
        return Err(AdminErrors::AlreadySuperAdmin);
    };

    let new_admin:Admin=Admin { 
        wallet_id: id,
        role:AdminRole::SuperAdmin,
        spaces:old_admin.spaces
    };
    let inserted = SUPER_ADMIN.with(|arr| arr.borrow_mut().push(&id));

    if inserted.is_err(){
        return Err(AdminErrors::ErrorUpdatingAdmin)
    };

    let updated=ADMIN_MAP.with(|map| map.borrow_mut().insert(id, new_admin));
    match updated {
        Some(_) => return Ok(()),
        None => {
            return Err(AdminErrors::ErrorUpdatingAdmin)
        }
    }
}


#[ic_cdk::query(guard = check_anonymous)]
pub fn get_all_super_admins()->Result<Vec<Principal>,AdminErrors>{

    if !is_super_admin(caller()) {
        return Err(AdminErrors::NotASuperAdmin)
    }

    let super_admins:Vec<Principal> =  SUPER_ADMIN.with(|vec| vec.borrow().iter().collect());
    return  Ok(super_admins);
}

#[ic_cdk::query(guard = check_anonymous)]
pub fn get_admin()->Result<Admin,AdminErrors>{
    let admin = ADMIN_MAP.with(|map| map.borrow().get(&caller()));
    
    match admin{
        Some(value) => Ok(value),
        None => Err(AdminErrors::NotRegisteredAsAdmin)
    }
}

#[ic_cdk::query(guard = check_anonymous)]
pub fn get_admin_by_principal(id:Principal)->Result<Admin,AdminErrors>{

    if !is_super_admin(caller()) {
        return Err(AdminErrors::NotASuperAdmin)
    }

    let admin = ADMIN_MAP.with(|map| map.borrow().get(&id));
    
    match admin{
        Some(value) => Ok(value),
        None => Err(AdminErrors::NotRegisteredAsAdmin)
    }
}



pub fn is_super_admin(caller:Principal)->bool{
    let contains=SUPER_ADMIN.with(|arr| arr.borrow().iter().find(|&p| p==caller));

    if contains.is_none(){
        return false
    }

    return true
}

pub fn is_valid_admin(caller:Principal)->bool{
    let admin=ADMIN_MAP.with(|map| map.borrow().get(&caller));

    if admin.is_none(){
        return false
    }
    return true;
}