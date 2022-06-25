use serde::Serialize;

use crate::enums::response_code::ResponseCode;

//A standard response that always contains a status
#[derive(Serialize)]
pub struct GenericResponse<T> {
    pub status: ResponseCode,
    pub data: T,
}
