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

#[tokio::main]
async fn main() {
    const VERSION: Option<&str> = option_env!("CARGO_PKG_VERSION");

    println!("💸 something version {} 💸", VERSION.unwrap_or("UNKNOWN"));

    if let Err(err) = rocket::build()
        .mount("/", routes![checkout, add_item])
        .launch()
        .await
    {
        println!("{}", err);
    }
}
