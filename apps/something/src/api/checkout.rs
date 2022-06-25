extern crate dotenv;
use crate::enums::response_code::ResponseCode;
use crate::models::generic_response::GenericResponse;
use diesel::{mysql::MysqlConnection, Connection};
use dotenv::dotenv;
use reqwest::StatusCode;
use reqwest::{self, header::CONTENT_TYPE};
use rocket::response;
use serde::{Deserialize, Serialize};
use std::env;
use std::f32::consts::E;

fn handleError(err: reqwest::Error) -> GenericResponse<bool> {
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
        data: true,
    }
}

#[derive(Debug, Serialize)]
struct SessionOptions {
    success_url: String,
    cancel_url: String,
    ice_tea: String,
    mode: String,
}

#[put("/checkout")]
pub async fn checkout() -> String {
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

    if let Err(e) = res {
        handleError(e);
    }

    // let url = match res {
    //     Ok(x) => x,
    //     Err(_) => todo!(),
    // };

    // println!("{}", res.);
    String::from("")
}

// let res: Session = reqwest::Client::new()
// .post(format!(
//     "https://{}@api.stripe.com/v1/checkout/sessions",
//     stripe_key
// ))
// .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
// .form(&[
//     ("success_url", "https://example.com/success"),
//     ("cancel_url", "https://example.com/success"),
//     ("mode", "payment"),
//     ("line_items[0][price]", "price_1L88f0KBi9YpHhPGJnB4uxjX"),
//     ("line_items[0][quantity]", "11"),
// ])
// .send()
// .await
// .unwrap()
// .json()
// .await
// .unwrap();
