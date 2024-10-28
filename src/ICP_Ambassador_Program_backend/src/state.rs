use ic_stable_structures::memory_manager::{MemoryId, MemoryManager,VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable,StableVec};
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::borrow::Cow;
use crate::types;

type Memory=VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER:RefCell<MemoryManager<DefaultMemoryImpl>>=RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    pub static USER_PROFILE_MAP:RefCell<StableBTreeMap<String,UserProfile,Memory>>=RefCell::new(StableBTreeMap::new(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
    ));

    pub static SUPER_ADMIN:RefCell<StableVec<Principal,Memory>>=RefCell::new(StableVec::new(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
    ).unwrap());

    pub static ADMIN_MAP:RefCell<StableBTreeMap<Principal,Admin,Memory>>=RefCell::new(StableBTreeMap::new(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
    ));

    pub static SPACE_MAP:RefCell<StableBTreeMap<String,Space,Memory>>=RefCell::new(StableBTreeMap::new(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3)))
    ))
}

// storables

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct UserProfile {
    pub wallet_id: Option<Principal>,
    pub discord_id: String,
    pub username: String,
    pub referral_code: Option<String>,
}

// Implement the Storable trait for UserProfile
impl Storable for UserProfile {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        let serialized = serde_cbor::to_vec(self).expect("Failed to serialize UserProfile");
        Cow::Owned(serialized)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        serde_cbor::from_slice(&bytes).expect("Failed to deserialize UserProfile")
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct Admin{
    pub wallet_id:Principal,
    pub role:types::AdminRole
}

impl Storable for Admin{
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        let serialized = serde_cbor::to_vec(self).expect("Failed to serialize Admin");
        Cow::Owned(serialized)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        serde_cbor::from_slice(&bytes).expect("Failed to deserialize Admin")
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct Space{
    pub space_id:String,
    pub owner:Principal,
    pub name:String,
    pub slug:String,
    pub description:String,
    pub chain:String,
    pub logo:Option<String>,
    pub bg_img:Option<String>,
    pub shor_description:Option<String>,
    pub bg_css:Option<String>,
    pub urls:types::SpaceURLs
}

impl Storable for Space{
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        let serialized = serde_cbor::to_vec(self).expect("Failed to serialize Spaces");
        Cow::Owned(serialized)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        serde_cbor::from_slice(&bytes).expect("Failed to deserialize Spaces")
    }
}
