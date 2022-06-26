use crate::enums::response_code::ResponseCode;
use rocket::serde::{Deserialize, Serialize};

//A standard response that always contains a status
#[derive(Debug, Serialize, Deserialize)]
pub struct GenericResponse {
    pub status: ResponseCode,
    pub data: String,
}
