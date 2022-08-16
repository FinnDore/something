#![allow(non_snake_case)]
use crate::enums::response_code::ResponseCode;
use crate::DbConnPool;

use crate::middleware::AuthMiddleware;
use crate::models::generic_response::VoidGenericResponse;

use rocket::http::Status;
use rocket::response::status::{self, Custom};
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct RequestBody {
    priceId: String,
    name: String,
    description: String,
}

// Takes a list of items and returns a checkout url
#[put("/add-item", data = "<req>")]
pub async fn add_item(
    req: Json<RequestBody>,
    db_conn_pool: DbConnPool,
    _auth: AuthMiddleware,
) -> Custom<Json<VoidGenericResponse>> {
    use crate::schema::items::dsl::{description, id, items, name, priceId};
    use diesel::prelude::*;

    let new_item = vec![(
        id.eq(cuid::cuid().unwrap()),
        name.eq(req.name.to_owned()),
        description.eq(req.description.to_owned()),
        priceId.eq(req.priceId.to_owned()),
    )];

    let insert_res = db_conn_pool
        .run(|conn| diesel::insert_into(items).values(new_item).execute(&*conn))
        .await;

    if let Err(_err) = insert_res {
        return status::Custom(
            Status::InternalServerError,
            Json(VoidGenericResponse {
                status: ResponseCode::ERROR,
            }),
        );
    }

    status::Custom(
        Status::Ok,
        Json(VoidGenericResponse {
            status: ResponseCode::OK,
        }),
    )
}
