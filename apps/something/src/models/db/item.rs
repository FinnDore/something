#![allow(non_snake_case)]

use diesel::Queryable;
use rocket::serde::{Deserialize, Serialize};
use rust_decimal::prelude::Decimal;

// A shop  item
#[derive(Debug, Serialize, Deserialize, Queryable)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub description: String,
    pub priceId: String,
    pub price: Decimal,
}
// A shop item with all the private stuff stripped
#[derive(Debug, Serialize, Deserialize, Queryable)]
pub struct PublicItem {
    pub id: String,
    pub name: String,
    pub description: String,
    pub price: Decimal,
}
