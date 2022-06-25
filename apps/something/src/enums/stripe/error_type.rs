use serde::Serialize;

#[derive(Serialize)]
pub enum SErrorType {
    InvalidRequestError,
    ApiError,
    CardError,
    IdempotencyError,
}

impl SErrorType {
    fn as_str(&self) -> &'static str {
        match self {
            SErrorType::InvalidRequestError => "invalid_request_error",
            SErrorType::ApiError => "api_error",
            SErrorType::CardError => "card_error",
            SErrorType::IdempotencyError => "idempotency_error",
        }
    }
}
