use std::io::Cursor;
use std::sync::atomic::{AtomicUsize, Ordering};

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{ContentType, Method, Status};
use rocket::request::FromRequest;
use rocket::{Data, Request, Response};

pub struct AuthMiddleware {
    secret_header: String,
}

impl Default for AuthMiddleware {
    fn default(secret: &str) -> Self {
        AuthMiddleware {
            secret_header: format!("barer {}", secret).to_string(),
        }
    }
}

// impl Fairing for AuthMiddleware {
//     // This is a request and response fairing named "GET/POST Counter".
//     fn info(&self) -> Info {
//         Info {
//             name: "AuthMiddleware",
//             kind: Kind::Request,
//         }
//     }

//     // Increment the counter for `GET` and `POST` requests.
//     fn on_request(&self, request: &mut Request, _: &Data) {
//         match request.headers().get_one("Authorization") {
//             Some(auth) => {
//                 if auth == self.secret_header {
//                     return Status::Ok;
//                 } else {
//                     return Status::Unauthorized;
//                 }
//             }
//             None => {
//                 // If no Authorization header is present, return a 401 Unauthorized response.

//                 Status::Unauthorized
//             }
//         }
//     }
// }

// #[get("/<_..>", rank = 1)]
// pub fn authMiddleware(req: Request) -> Status {
//     // check if the request has an valid Authorization header and return a 401 Unauthorized response if not
//     match req.headers().get_one("Authorization") {
//         Some(auth) => {
//             if auth == "Bearer a" {
//                 return Status::Ok;
//             } else {
//                 return Status::Unauthorized;
//             }
//         }
//         None => {
//             // If no Authorization header is present, return a 401 Unauthorized response.
//             Status::Unauthorized
//         }
//     }
// }

impl<'r> FromRequest<'r> for AuthMiddleware {
    type Error = ApiError;
    async fn from_request(
        req: &'r Request<'_>,
    ) -> request::Outcome<Self, Self::Error> {
        let auth_header = req.headers().get_one("Authorization");

        if auth_header.is_none() || auth_header.unwrap() != "Bearer a" {
            return Outcome::Failure((
                Status::Unauthorized,
                ApiError::Unauthorized,
            ));
        }

        request::Outcome::Success()
    }
}

// impl Default for AuthMiddleware {
//     fn default(secret: String) -> AuthMiddleware {
//         AuthMiddleware {
//             secret_header: secret,
//         }
//     }
// }
