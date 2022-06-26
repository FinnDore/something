use serde::{Deserialize, Serialize};
use strum::EnumString;

#[derive(Debug, Deserialize, Serialize, EnumString)]
pub enum ResponseCode {
    ERROR,
    OK,
}
