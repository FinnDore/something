use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum ResponseCode {
    ERROR,
    Ok,
}
