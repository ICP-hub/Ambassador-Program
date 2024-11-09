use candid::{encode_one, Principal};
use ic_cdk::api::{call::{CallResult, RejectionCode}, management_canister::main::{CanisterInstallMode, WasmModule}};
use crate::{CreateFileInput,ProfileImageData,IMAGE_MAP,ReturnResult,ImageIdWrapper};


#[ic_cdk::update]
pub async fn upload_profile_image(asset_canister_id: String, image_data: ProfileImageData) -> Result<String, String> {
    let principal = ic_cdk::api::caller();  // Get the caller's principal

    let input = CreateFileInput {
        name: "profile_image.png".to_string(),
        content_type: "image/png".to_string(),
        size: None,
        content: image_data.content.clone(),
        status: Some(1),
        hash: None,
        ert: None,
        crc32: None,
    };

    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        Principal::from_text(asset_canister_id.clone()).unwrap(),
        "create_file",
        (input,)
    ).await;

    match response {
        Ok((Ok(image_id),)) => {
            // Update IMAGE_MAP with the uploaded image ID
            IMAGE_MAP.with(|image_map| {
                image_map.borrow_mut().insert(
                    principal.to_string(),
                    ImageIdWrapper { image_id: image_id.to_string() }  // Convert u32 to String
                );
            });

            Ok(format!("Profile image uploaded and updated with ID: {}", image_id))
        },
        Ok((Err(err),)) => Err(err),
        Err((code, message)) => match code {
            RejectionCode::NoError => Err("NoError".to_string()),
            RejectionCode::SysFatal => Err("SysFatal".to_string()),
            RejectionCode::SysTransient => Err("SysTransient".to_string()),
            RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
            RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
            _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
        }
    }
}



#[ic_cdk::query]
pub fn get_profile_image_id() -> Option<u32> {
    let principal = ic_cdk::api::caller();

    IMAGE_MAP.with(|image_map| {
        image_map.borrow()
            .get(&principal.to_string())
            .map(|wrapper| wrapper.image_id.parse::<u32>().ok())
            .flatten() // To convert Option<Result<u32, _>> to Option<u32>
    })
}








