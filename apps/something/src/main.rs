mod api;
mod enums;
mod models;
use crate::api::checkout;
extern crate dotenv;

#[macro_use]
extern crate rocket;

use diesel::{mysql::MysqlConnection, Connection};
use std::env;

#[launch]
fn rocket() -> _ {
    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    MysqlConnection::establish(&database_url)
        .expect("Error connecting to database");

    const VERSION: Option<&str> = option_env!("CARGO_PKG_VERSION");

    println!("💸 something version {} 💸", VERSION.unwrap_or("UNKNOWN"));

    rocket::build().mount("/", routes![checkout])
}
