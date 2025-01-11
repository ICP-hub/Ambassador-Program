use candid::Principal;
use ic_cdk::{caller,update,query};

use crate::{check_anonymous, Admin, AdminRole, Editors, Errors, Moderators, ADMIN_MAP, EDITOR_MAP, MODERATOR_MAP, SUPER_ADMIN};

#[update(guard = check_anonymous)]
pub fn register_moderator()->Result<(),Errors>{
    let admin =MODERATOR_MAP.with(|map| map.borrow().get(&caller()));
    
    if admin.is_some(){
        return Err(Errors::AlreadyModerator);
    };

    let new_mod:Moderators=Moderators { 
        wallet_id: caller(),
        role:AdminRole::Moderator,
        spaces:vec![]  
    };

    MODERATOR_MAP.with(|map| map.borrow_mut().insert(caller(), new_mod));
    return Ok(());
}

#[update(guard = check_anonymous)]
pub fn register_editor()->Result<(),Errors>{
    let admin =EDITOR_MAP.with(|map| map.borrow().get(&caller()));
    
    if admin.is_some(){
        return Err(Errors::AlreadyEditor);
    };

    let new_editor:Editors=Editors { 
        wallet_id: caller(),
        role:AdminRole::Editor,
        spaces:vec![]  
    };

    EDITOR_MAP.with(|map| map.borrow_mut().insert(caller(), new_editor));
    return Ok(());
}


// #[update(guard = check_anonymous)]
// pub fn add_admin_by_super_admin(id:Principal)->Result<(),Errors>{

//     if !is_super_admin(caller()) {
//         return Err(Errors::NotASuperAdmin)
//     }

//     let admin = ADMIN_MAP.with(|map| map.borrow().get(&id));
    
//     if admin.is_some(){
//         return Err(Errors::AlreadyAdmin);
//     };

//     let new_admin:Admin=Admin { 
//         wallet_id: id,
//         role:AdminRole::HubLeader,
//         spaces:vec![]    
//     };

//     ADMIN_MAP.with(|map| map.borrow_mut().insert(id, new_admin));
//     return Ok(());
// }

// #[update(guard = check_anonymous)]
// pub fn promote_to_super_admin(id:Principal)->Result<(), Errors>{

//     if !is_super_admin(caller()) {
//         return Err(Errors::NotASuperAdmin)
//     }

//     let admin = ADMIN_MAP.with(|map| map.borrow().get(&id));
//     let old_admin:Admin;

//     match admin {
//         Some(value) => old_admin=value,
//         None => return Err(Errors::NotRegisteredAsAdmin)
//     }

//     let super_admins=SUPER_ADMIN.with(|map| map.borrow().iter().any(|el| el==id));
//     if super_admins{
//         return Err(Errors::AlreadySuperAdmin);
//     };

//     let new_admin:Admin=Admin { 
//         wallet_id: id,
//         role:AdminRole::SuperAdmin,
//         spaces:old_admin.spaces
//     };
//     let inserted = SUPER_ADMIN.with(|arr| arr.borrow_mut().push(&id));

//     if inserted.is_err(){
//         return Err(Errors::ErrorUpdatingAdmin)
//     };

//     let updated=ADMIN_MAP.with(|map| map.borrow_mut().insert(id, new_admin));
//     match updated {
//         Some(_) => return Ok(()),
//         None => {
//             return Err(Errors::ErrorUpdatingAdmin)
//         }
//     }
// }


// #[query(guard = check_anonymous)]
// pub fn get_all_super_admins()->Result<Vec<Principal>,Errors>{

//     if !is_super_admin(caller()) {
//         return Err(Errors::NotASuperAdmin)
//     }

//     let super_admins:Vec<Principal> =  SUPER_ADMIN.with(|vec| vec.borrow().iter().collect());
//     return  Ok(super_admins);
// }

#[query(guard = check_anonymous)]
pub fn get_moderator()->Result<Moderators,Errors>{
    let moderator = MODERATOR_MAP.with(|map| map.borrow().get(&caller()));
    
    match moderator{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsModerator)
    }
}
#[query(guard = check_anonymous)]
pub fn get_editor()->Result<Editors,Errors>{
    let editor = EDITOR_MAP.with(|map| map.borrow().get(&caller()));
    
    match editor{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsEditor)
    }
}

// #[query(guard = check_anonymous)]
// pub fn get_admin_by_principal(id:Principal)->Result<Admin,Errors>{

//     if !is_super_admin(caller()) {
//         return Err(Errors::NotASuperAdmin)
//     }

//     let admin = ADMIN_MAP.with(|map| map.borrow().get(&id));
    
//     match admin{
//         Some(value) => Ok(value),
//         None => Err(Errors::NotRegisteredAsAdmin)
//     }
// }
#[query(guard = check_anonymous)]
pub fn get_moderator_by_principal(id:Principal)->Result<Moderators,Errors>{

    if !is_super_admin(caller()) {
        return Err(Errors::NotASuperAdmin)
    }

    let moderator = MODERATOR_MAP.with(|map| map.borrow().get(&id));
    
    match moderator{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsModerator)
    }
}
#[query(guard = check_anonymous)]
pub fn get_editor_by_principal(id:Principal)->Result<Editors,Errors>{

    if !is_super_admin(caller()) {
        return Err(Errors::NotASuperAdmin)
    }

    let editor = EDITOR_MAP.with(|map| map.borrow().get(&id));
    
    match editor{
        Some(value) => Ok(value),
        None => Err(Errors::NotRegisteredAsEditor)
    }
}



// pub fn is_super_admin(caller:Principal)->bool{
//     let contains=SUPER_ADMIN.with(|arr| arr.borrow().iter().find(|&p| p==caller));

//     if contains.is_none(){
//         return false
//     }

//     return true
// }

// pub fn is_valid_admin(caller:Principal)->bool{
//     let admin=ADMIN_MAP.with(|map| map.borrow().get(&caller));

//     if admin.is_none(){
//         return false
//     }
//     return true;
// }