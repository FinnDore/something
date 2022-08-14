use crate::enums::response_code::ResponseCode;
use crate::establish_connection;
use crate::middleware::AuthMiddleware;
use crate::models::db::item::Item;
use crate::models::generic_response::GenericResponse;

use diesel::QueryResult;
use reqwest::StatusCode;
use reqwest::{self, header::CONTENT_TYPE};

use rocket::http::Status;
use rocket::response::status::{self, Custom};
use rocket::serde::json::Json;
use rocket::Either;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct CheckoutItem {
    id: String,
    quantity: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RequestBody {
    success_url: String,
    cancel_url: String,
    items: Vec<CheckoutItem>,
}

#[derive(Debug, Deserialize)]
struct StripeResponse {
    url: String,
}

// Handles errors from stripe
fn handle_error(err: reqwest::Error) -> Custom<Json<GenericResponse<String>>> {
    if !err.is_request() || err.status().is_none() {
        println!("Server error while making request {}", err);
    }

    status::Custom(
        Status::InternalServerError,
        Json(GenericResponse {
            status: ResponseCode::ERROR,
            data: "".to_string(),
        }),
    )
}

fn get_items_by_id(item_ids: &Vec<String>) -> QueryResult<Vec<Item>> {
    use crate::schema::items::dsl::{id, items};
    use diesel::prelude::*;
    let conn = establish_connection();

    items.filter(id.eq_any(item_ids)).load::<Item>(&conn)
}

// Takes a list of items and returns a checkout url
#[put("/checkout", data = "<req>")]
pub async fn checkout(
    req: Json<RequestBody>,
    _auth: AuthMiddleware,
) -> Either<
    Custom<Json<GenericResponse<Vec<String>>>>,
    Custom<Json<GenericResponse<String>>>,
> {
    let stripe_key = env::var("STRIPE_SK").expect("STRIPE_SK must be set");

    let item_ids = &req
        .items
        .iter()
        .map(|item| item.id.to_string())
        .collect::<Vec<String>>();

    let potential_shop_items = get_items_by_id(item_ids);

    if let Err(_err) = potential_shop_items {
        return Either::Right(status::Custom(
            Status::InternalServerError,
            Json(GenericResponse {
                status: ResponseCode::ERROR,
                data: "".to_string(),
            }),
        ));
    }

    let shop_items = potential_shop_items.unwrap();

    let mut unknown_items: Vec<String> = if shop_items.is_empty() {
        item_ids.to_owned()
    } else {
        vec![]
    };

    let mut valid_items = req.items.iter().to_owned();
    for current_item_id in item_ids.iter() {
        if valid_items.any(|checkout_item| checkout_item.id != *current_item_id)
        {
            unknown_items.push(current_item_id.to_string());
        }
    }

    if !unknown_items.is_empty() {
        return rocket::Either::Left(status::Custom(
            Status::BadRequest,
            Json(GenericResponse {
                status: ResponseCode::CHECKOUT_UNKNOWN_ITEM,
                data: unknown_items,
            }),
        ));
    }

    let mut items_by_id = HashMap::new();
    for item in &req.items {
        items_by_id.insert(item.id.to_string(), item.quantity);
    }

    let mut form: Vec<(String, String)> = vec![
        ("success_url".to_string(), req.success_url.to_string()),
        ("cancel_url".to_string(), req.cancel_url.to_string()),
        ("mode".to_string(), "payment".to_string()),
    ];

    for (i, current_item) in shop_items.iter().enumerate() {
        form.push((
            format!("line_items[{i}][price]").to_owned(),
            current_item.priceId.to_owned(),
        ));
        form.push((
            format!("line_items[{i}][quantity]").to_owned(),
            items_by_id.get(&current_item.id).unwrap().to_string(),
        ));
    }

    let res = reqwest::Client::new()
        .post(format!(
            "https://{}@api.stripe.com/v1/checkout/sessions",
            stripe_key
        ))
        .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
        .form(&form)
        .send()
        .await;

    if let Err(err) = res {
        return rocket::Either::Right(handle_error(err));
    }

    let res_body = res.unwrap().json().await;

    if let Err(_err) = res_body {
        return rocket::Either::Right(status::Custom(
            Status::InternalServerError,
            Json(GenericResponse {
                status: ResponseCode::ERROR,
                data: "".to_string(),
            }),
        ));
    }

    let stripe_response: StripeResponse = res_body.unwrap();

    rocket::Either::Right(status::Custom(
        Status::Ok,
        Json(GenericResponse {
            data: stripe_response.url,
            status: ResponseCode::OK,
        }),
    ))
}
