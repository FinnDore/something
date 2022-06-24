extern crate dotenv;

#[macro_use]
extern crate rocket;

use diesel::{mysql::MysqlConnection, Connection};
use dotenv::dotenv;
use reqwest::{self, header::CONTENT_TYPE};
use rocket::response;
use serde::{Deserialize, Serialize};
use std::env;

struct GenericResponse<T> {
    pub status: String,
    pub data: T,
}

#[derive(Debug, Serialize)]
struct SessionOptions {
    success_url: String,
    cancel_url: String,
    ice_tea: String,
    mode: String,
}
#[derive(Debug, Deserialize)]
struct Session {
    url: String,
}

#[get("/checkout")]
async fn checkout() -> Result<(), ()> {
    let stripe_key = env::var("STRIPE_SK").expect("STRIPE_SK must be set");

    let sessionOptions = SessionOptions {
        success_url: String::from("https://example.com/success"),
        cancel_url: String::from("https://example.com/success"),
        ice_tea: String::from("price_1L88f0KBi9YpHhPGJnB4uxjX"),
        mode: String::from("payment"),
    };

    let res: Session = reqwest::Client::new()
        .post(format!(
            "https://{}@api.stripe.com/v1/checkout/sessions",
            stripe_key
        ))
        .json(&sessionOptions)
        .send()
        .await
        .unwrap()
        .json()
        .await
        .unwrap();
    Ok(())
    // GenericResponse {status: String::from("a"),data: String::from("a")}
}

#[get("/")]
async fn index() -> String {
    let stripe_key = env::var("STRIPE_SK").expect("STRIPE_SK must be set");

    let res: Session = reqwest::Client::new()
        .post(format!(
            "https://{}@api.stripe.com/v1/checkout/sessions",
            stripe_key
        ))
        .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
        .form(&[
            ("success_url", "https://example.com/success"),
            ("cancel_url", "https://example.com/success"),
            ("mode", "payment"),
            ("line_items[0][price]", "price_1L88f0KBi9YpHhPGJnB4uxjX"),
            ("line_items[0][quantity]", "11"),
        ])
        .send()
        .await
        .unwrap()
        .json()
        .await
        .unwrap();

    println!("{}", res.url);
    res.url
}

#[launch]
fn rocket() -> _ {
    // dotenv().expect("Cant resolve .env file");

    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    MysqlConnection::establish(&database_url)
        .expect("Error connecting to database");

    const VERSION: Option<&str> = option_env!("CARGO_PKG_VERSION");

    println!("💸 something version {} 💸", VERSION.unwrap_or("UNKNOWN"));

    rocket::build().mount("/", routes![index])
}
