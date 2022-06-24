use diesel::{mysql::MysqlConnection, Connection};

#[macro_use]
extern crate rocket;
extern crate dotenv;

use dotenv::dotenv;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!1"
}

#[launch]
fn rocket() -> _ {
    dotenv().ok();

    let database_url = option_env!("DATABASE_URL").expect("DATABASE_URL must be set");
    MysqlConnection::establish(&database_url).expect("Error connecting to database");

    const VERSION: Option<&str> = option_env!("CARGO_PKG_VERSION");

    println!("💸 something version {} 💸", VERSION.unwrap_or("UNKNOWN"));

    rocket::build().mount("/", routes![index])
}
