mod api;
mod enums;
mod middleware;
pub mod models;
pub mod schema;
use std::env;

use api::add_item::add_item;
use api::checkout::checkout;

use diesel_migrations::embed_migrations;

extern crate dotenv;

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

use rocket_sync_db_pools::{ database};

#[database("mysql")]
struct DbConn(diesel::MysqlConnection);

use diesel::{mysql::MysqlConnection, Connection};
use rocket::{fairing::AdHoc, Build, Rocket};

pub fn establish_connection() -> MysqlConnection {
    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    MysqlConnection::establish(&database_url)
        .expect("Error connecting to database")
}

async fn run_db_migrations(
    rocket: Rocket<Build>,
) -> Result<Rocket<Build>, Rocket<Build>> {
    let conn = establish_connection();
    match embedded_migrations::run(&conn) {
        Ok(()) => Ok(rocket),
        Err(e) => {
            error!("Failed to run database migrations: {:?}", e);
            Err(rocket)
        }
    }
}

embed_migrations!("./migrations");
#[launch]
fn rocket() -> _ {
    const VERSION: Option<&str> = option_env!("CARGO_PKG_VERSION");

    println!("💸 something version {} 💸", VERSION.unwrap_or("UNKNOWN"));

    rocket::build()
        .attach(AdHoc::try_on_ignite(
            "Database Migrations",
            run_db_migrations,
        ))
        .
        .mount("/", routes![checkout, add_item])
}
