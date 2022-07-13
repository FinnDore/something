#![allow(non_snake_case)]

use diesel::Queryable;
use rocket::serde::{Deserialize, Serialize};
// A shop  item
#[derive(Debug, Serialize, Deserialize, Queryable)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub description: String,
    pub priceId: String,
}
