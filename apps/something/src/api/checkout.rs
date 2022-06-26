extern crate dotenv;
use crate::enums::response_code::ResponseCode;
use crate::models::generic_response::GenericResponse;
use diesel::{mysql::MysqlConnection, Connection};
use dotenv::dotenv;
use reqwest::StatusCode;
use reqwest::{self, header::CONTENT_TYPE};
use rocket::response;
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};
use std::env;
use std::f32::consts::E;

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

fn handle_error(err: reqwest::Error) -> GenericResponse {
    let status = err.status();
    if status.is_none() || err.is_decode() {
        print!("is None")
    }

    let raw_status = status.unwrap();

    if raw_status == StatusCode::BAD_REQUEST {
        print!("bad req")
    }
    if raw_status.as_u16() >= 401 && raw_status.as_u16() <= 499 {
        print!("bad req more")
    }

    GenericResponse {
        status: ResponseCode::ERROR,
        data: "".to_string(),
    }
}

#[put("/checkout")]
pub async fn checkout() -> Json<GenericResponse> {
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

    match res {
        Ok(response) => {
            let stripeResponse: StripeResponse = response.json().await.unwrap();
            Json(GenericResponse {
                data: stripeResponse.url.to_owned(),
                status: ResponseCode::Ok,
            })
        }
        Err(err) => Json(handle_error(err)),
    }
}
