use crate::enums::response_code::ResponseCode;
use crate::models::generic_response::GenericResponse;

use reqwest::StatusCode;
use reqwest::{self, header::CONTENT_TYPE};
use rocket::http::Status;
use rocket::response::status::{self, Custom};
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize)]
struct SessionOptions {
    success_url: String,
    cancel_url: String,
    ice_tea: String,
    mode: String,
}

#[derive(Debug, Deserialize)]
struct StripeResponse {
    url: String,
}

// Handles errors from stripe
fn handle_error(err: reqwest::Error) -> Custom<Json<GenericResponse>> {
    let status = err.status();
    if status.is_none() || err.is_decode() {
        print!("is None");
        return status::Custom(
            Status::InternalServerError,
            Json(GenericResponse {
                status: ResponseCode::ERROR,
                data: "".to_string(),
            }),
        );
    }

    let raw_status = status.unwrap();

    if raw_status == StatusCode::BAD_REQUEST {
        print!("bad req");
        return status::Custom(
            Status::BadRequest,
            Json(GenericResponse {
                status: ResponseCode::ERROR,
                data: "".to_string(),
            }),
        );
    }

    status::Custom(
        Status::InternalServerError,
        Json(GenericResponse {
            status: ResponseCode::ERROR,
            data: "".to_string(),
        }),
    )
}

// Takes a list of items and returns a checkout url
#[put("/checkout")]
pub async fn checkout() -> Custom<Json<GenericResponse>> {
    let stripe_key = env::var("STRIPE_SK").expect("STRIPE_SK must be set");

    let form = [
        ("success_url", "https://example.com/success"),
        ("cancel_url", "https://example.com/success"),
        ("mode", "payment"),
        ("line_items[0][price]", "price_1L88f0KBi9YpHhPGJnB4uxjX"),
        ("line_items[0][quantity]", "11"),
    ];

    let res = reqwest::Client::new()
        .post(format!(
            "https://{}@api.stripe.com/v1/checkout/sessions",
            stripe_key
        ))
        .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
        .form(&form)
        .send()
        .await;

    if let Err(err) = res {
        return handle_error(err);
    }

    let res_body = res.unwrap().json().await;

    if let Err(_err) = res_body {
        return status::Custom(
            Status::InternalServerError,
            Json(GenericResponse {
                status: ResponseCode::ERROR,
                data: "".to_string(),
            }),
        );
    }

    let stripe_response: StripeResponse = res_body.unwrap();

    status::Custom(
        Status::Ok,
        Json(GenericResponse {
            data: stripe_response.url.to_owned(),
            status: ResponseCode::OK,
        }),
    )
}
