use serde::Serialize;
use strum::EnumString;

#[derive(Serialize, EnumString)]
pub enum SErrorType {
    InvalidRequestError,
    ApiError,
    CardError,
    IdempotencyError,
}
