mod api;
mod enums;
pub mod models;
pub mod schema;
use api::add_item::add_item;
use api::checkout::checkout;
extern crate dotenv;

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;

use diesel::{mysql::MysqlConnection, Connection};
use rocket::tokio;
use std::env;

pub fn establish_connection() -> MysqlConnection {
    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    MysqlConnection::establish(&database_url)
        .expect("Error connecting to database")
}

#[launch]
fn rocket() -> _ {
    const VERSION: Option<&str> = option_env!("CARGO_PKG_VERSION");
    const ADDR: Option<&str> = option_env!("ROCKET_ADDRESS");
    // check if we are running a release build or not
    env::set_var("ROCKET_ADDRESS", "0.0.0.0");
    const A: Option<&str> = option_env!("ROCKET_ADDRESS");

    println!("💸 something version {} 💸", VERSION.unwrap_or("UNKNOWN"));
    println!("addr {} 💸", ADDR.unwrap_or("UNKNOWN"));
    println!("a {} 💸", A.unwrap_or("UNKNOWN"));

    rocket::build().mount("/", routes![checkout, add_item])
}
