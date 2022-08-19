use crate::enums::response_code::ResponseCode;
use crate::DbConnPool;

use crate::middleware::AuthMiddleware;
use crate::models::db::item::PublicItem;
use crate::models::generic_response::{GenericResponse, VoidGenericResponse};
use crate::schema::items;

use rocket::http::Status;
use rocket::response::status::{self, Custom};
use rocket::serde::json::Json;
use rocket::Either;

type AllColumns = (items::id, items::name, items::description);
const ALL_COLUMNS: AllColumns = (items::id, items::name, items::description);

// Returns all items in the shop
#[get("/get-items")]
pub async fn get_items(
    db_conn_pool: DbConnPool,
    _auth: AuthMiddleware,
) -> Either<
    Custom<Json<GenericResponse<Vec<PublicItem>>>>,
    Custom<Json<VoidGenericResponse>>,
> {
    use crate::schema::items::dsl::items;
    use diesel::prelude::*;

    match db_conn_pool
        .run(|conn| items.select(ALL_COLUMNS).load::<PublicItem>(&*conn))
        .await
    {
        Err(_err) => rocket::Either::Right(status::Custom(
            Status::InternalServerError,
            Json(VoidGenericResponse {
                status: ResponseCode::ERROR,
            }),
        )),
        Ok(current_items) => rocket::Either::Left(status::Custom(
            Status::Ok,
            Json(GenericResponse {
                status: ResponseCode::OK,
                data: current_items,
            }),
        )),
    }
}
