use crate::enums::response_code::ResponseCode;
use crate::models::generic_response::VoidGenericResponse;
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome, Request};
use rocket::serde::json::Json;
use std::env;

pub struct AuthMiddleware {}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthMiddleware {
    type Error = Json<VoidGenericResponse>;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let secret = env::var("AUTH_SECRET");
        if secret.is_err() {
            return Outcome::Success(AuthMiddleware {});
        }
        let secret = secret.unwrap();

        match req.headers().get_one("Authorization") {
            None => Outcome::Failure((
                Status::Unauthorized,
                Json(VoidGenericResponse {
                    status: ResponseCode::PROVIDE_AUTH_SECRET,
                }),
            )),
            Some(header) if header != format!("Bearer {}", secret) => {
                Outcome::Failure((
                    Status::Unauthorized,
                    Json(VoidGenericResponse {
                        status: ResponseCode::INVALID_AUTH_SECRET,
                    }),
                ))
            }
            Some(_) => Outcome::Success(AuthMiddleware {}),
        }
    }
}
