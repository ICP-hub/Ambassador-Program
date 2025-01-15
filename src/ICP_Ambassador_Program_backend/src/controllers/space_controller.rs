use candid::{Nat, Principal};
use ic_cdk::{caller,query,update};
// use uuid::Uuid;
use crate::deposit::deposit_icp_to_canister;

use crate::{check_anonymous, Admin, CreateSpace, Errors, FundEntry, Space, SpaceURLs, ADMIN_MAP, SPACE_FUND_MAP, SPACE_MAP};

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
        mission_count:0,
        conversion:space.conversion,
        moderators:Vec::new(),
        editors:Vec::new()
    };

    let inserted=SPACE_MAP.with(|map| map.borrow_mut().insert(new_space.space_id.clone(), new_space));
    return Ok(inserted);
}

#[update(guard = check_anonymous)]
// add guard to check if the caller is the owner of the space or a Moderator or ed
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

#[update]
pub fn withdraw_funds(id:String,amount:u64)->Result<String,String>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&id));
    let space_val:Space;
    match space{
        Some(val)=>space_val=val,
        None=>return Err(String::from("No space found to lock funds for"))
    }
    let funds=SPACE_FUND_MAP.with(|map| map.borrow().get(&space_val.space_id.clone()));
    let mut fund_val:FundEntry;
    match funds {
        Some(val)=>fund_val=val,
        None=>{
            fund_val=FundEntry{
                balance:0,
                locked:0,
                space_id:space_val.space_id.clone()
            }
        }
    }
    let avalable_fund=fund_val.balance-fund_val.locked-10_000;
    if avalable_fund<amount{
        return Err(String::from("Insufficient funds for this action, please add more funds"));
    }
    fund_val.balance-=amount;
    SPACE_FUND_MAP.with(|map| map.borrow_mut().insert(space_val.space_id, fund_val));
    return Ok(String::from("funds withdrawal successful, ICRC transaction needs to be implemented"))
}

#[update]
pub async fn add_funds(id:String,amount:u64)->Result<String,String>{
    ic_cdk::println!("Adding funds to space {}",id);
    ic_cdk::println!("Amount: {}",Nat::from(amount),);

    let space=SPACE_MAP.with(|map| map.borrow().get(&id));
    let space_val:Space;
    match space{
        Some(val)=>space_val=val,
        None=>return Err(String::from("No space found to add funds to"))
    }
 
    // icrc transaction should take place here
    deposit_icp_to_canister(amount).await?;

    // -----------------------------------
    let funds=SPACE_FUND_MAP.with(|map| map.borrow().get(&space_val.space_id.clone()));
    let mut fund_val:FundEntry;
    match funds {
        Some(val)=>fund_val=val,
        None=>{
            fund_val=FundEntry{
                balance:0,
                locked:0,
                space_id:space_val.space_id.clone()
            }
        }
    }
    fund_val.balance+=amount;
    SPACE_FUND_MAP.with(|map| map.borrow_mut().insert(space_val.space_id,fund_val));
    return Ok(String::from("Added new funds, ICRC transfer needs to be implemented here"));
}

pub fn lock_funds(id:String,amount:u64)->Result<(),String>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&id));
    let space_val:Space;
    match space{
        Some(val)=>space_val=val,
        None=>return Err(String::from("No space found to lock funds for"))
    }
    let funds=SPACE_FUND_MAP.with(|map| map.borrow().get(&space_val.space_id.clone()));
    let mut fund_val:FundEntry;
    match funds {
        Some(val)=>fund_val=val,
        None=>{
            fund_val=FundEntry{
                balance:0,
                locked:0,
                space_id:space_val.space_id.clone()
            }
        }
    }
    let avalable_fund=fund_val.balance-fund_val.locked;
    if avalable_fund<amount{
        return Err(String::from("Insufficient funds for this action, please add more funds"));
    }
    fund_val.locked+=amount;
    SPACE_FUND_MAP.with(|map| map.borrow_mut().insert(space_val.space_id, fund_val));
    return Ok(());

}

pub fn unlock_funds(id:String,amount:u64)->Result<(),String>{
    let space=SPACE_MAP.with(|map| map.borrow().get(&id));
    let space_val:Space;
    match space{
        Some(val)=>space_val=val,
        None=>return Err(String::from("No space found to lock funds for"))
    }
    let funds=SPACE_FUND_MAP.with(|map| map.borrow().get(&space_val.space_id.clone()));
    let mut fund_val:FundEntry;
    match funds {
        Some(val)=>fund_val=val,
        None=>{
            fund_val=FundEntry{
                balance:0,
                locked:0,
                space_id:space_val.space_id.clone()
            }
        }
    }
    // let avalable_fund=fund_val.balance-fund_val.locked;
    if fund_val.locked<amount{
        return Err(String::from("Insufficient funds for this action, please add more funds"));
    }
    fund_val.locked-=amount;
    SPACE_FUND_MAP.with(|map| map.borrow_mut().insert(space_val.space_id, fund_val));
    return Ok(());

}

#[query]
pub fn get_fund_details(id:String)->Option<FundEntry>{
    return SPACE_FUND_MAP.with(|map| map.borrow().get(&id));
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
