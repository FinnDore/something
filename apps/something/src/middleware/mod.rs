use std::io::Cursor;
use std::sync::atomic::{AtomicUsize, Ordering};

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{ContentType, Method, Status};
use rocket::request::{FromRequest, Outcome};
use rocket::response::status::{self, Custom};
use rocket::serde::json::Json;
use rocket::{outcome, Data, Request, Response};

use crate::enums::response_code::ResponseCode;
use crate::models::generic_response::VoidGenericResponse;

pub struct AuthMiddleware {
    secret_header: String,
}
struct ApiKey<'r>(&'r str);

#[derive(Debug)]
pub enum ApiKeyError {
    Missing,
    Invalid,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthMiddleware {
    type Error = Json<VoidGenericResponse>;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match req.headers().get_one("Authorization") {
            None => Outcome::Failure((
                Status::Unauthorized,
                Json(VoidGenericResponse {
                    status: ResponseCode::PROVIDE_AUTH_SECRET,
                }),
            )),
            Some(header) if header != "Bearer secret" => Outcome::Failure((
                Status::Unauthorized,
                Json(VoidGenericResponse {
                    status: ResponseCode::INVALID_AUTH_SECRET,
                }),
            )),
            Some(_) => Outcome::Success(AuthMiddleware {
                secret_header: "Bearer secret".to_string(),
            }),
        }

        // if auth_header.is_none() || auth_header.unwrap() != "Bearer a" {
        //     return Outcome::Failure((
        //         Status::Unauthorized,
        //         VoidGenericResponse {
        //             status: ResponseCode::UNAUTHORIZED,
        //         },
        //     ));
        // } else {
        //     return Outcome::Success((Status::Ok, ApiKey("aa")));
        // }
        // if auth_header.is_none() || auth_header.unwrap() != "Bearer a" {
        //     return Outcome::Success(status::Custom(
        //         Status::InternalServerError,
        //         Json(VoidGenericResponse {
        //             status: ResponseCode::ERROR,
        //         }),
        //     ));
        // } else {
        //     return Outcome::Success(status::Custom(
        //         Status::Ok,
        //         Json(VoidGenericResponse {
        //             status: ResponseCode::OK,
        //         }),
        //     ));
        // }
    }
}

// impl Default for AuthMiddleware {
//     fn default(secret: String) -> AuthMiddleware {
//         AuthMiddleware {
//             secret_header: secret,
//         }
//     }
// }
