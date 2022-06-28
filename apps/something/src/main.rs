mod api;
mod enums;
pub mod models;
pub mod schema;
use api::checkout::checkout;
extern crate dotenv;

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;

use diesel::{mysql::MysqlConnection, Connection};
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

    println!("💸 something version {} 💸", VERSION.unwrap_or("UNKNOWN"));

    rocket::build().mount("/", routes![checkout])
}
