use serde::{Deserialize, Serialize};

use crate::enums::response_code::ResponseCode;

//A standard response that always contains a status
#[derive(Debug, Serialize, Deserialize)]
pub struct GenericResponse {
    pub status: ResponseCode,
    pub data: String,
}
