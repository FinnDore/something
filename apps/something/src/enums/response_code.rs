#![allow(non_camel_case_types)]

use serde::{Deserialize, Serialize};
use strum::EnumString;

#[derive(Debug, Deserialize, Serialize, EnumString)]
pub enum ResponseCode {
    ERROR,
    OK,
    CHECKOUT_UNKNOWN_ITEM,
    CHECKOUT_OUT_OF_STOCK,
    PROVIDE_AUTH_SECRET,
    INVALID_AUTH_SECRET,
}
