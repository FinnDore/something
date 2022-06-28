use crate::enums::response_code::ResponseCode;
use crate::models::generic_response::GenericResponse;
use crate::{establish_connection, schema};

use crate::models::db::item::{self, Item};
use crate::schema::items::columns;
use crate::schema::orders::itemId;
use diesel::prelude::*;
use diesel::{mysql::MysqlConnection, Connection};
use reqwest::StatusCode;
use reqwest::{self, header::CONTENT_TYPE};
use rocket::http::private::Array;
use rocket::http::Status;
use rocket::response::status::{self, Custom};
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};
use std::env;
use std::process::id;

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

    use crate::schema::items::dsl::*;
    use diesel::prelude::*;

    let conn = establish_connection();

    let shop_item = items
        .filter(id.eq("fcd41d03-6cf1-4535-b609-08dc2e4bd5a5"))
        .load::<Item>(&conn)
        .expect("no item");

    if shop_item.is_empty() {
        return status::Custom(
            Status::BadRequest,
            Json(GenericResponse {
                status: ResponseCode::ERROR,
                data: "".to_string(),
            }),
        );
    }

    let mut form: Vec<(String, String)> = vec![
        (
            "success_url".to_string(),
            "https://example.com/success".to_string(),
        ),
        (
            "cancel_url".to_string(),
            "https://example.com/success".to_string(),
        ),
        ("mode".to_string(), "payment".to_string()),
    ];

    for (i, current_item) in shop_item.iter().enumerate() {
        form.push((
            format!("line_items[{i}][price]").to_owned(),
            current_item.priceId.to_owned(),
        ));
        form.push((
            format!("line_items[{i}][quantity]").to_owned(),
            "11".to_owned(),
        ));
    }

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
