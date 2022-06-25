use serde::Serialize;

#[derive(Serialize)]
pub enum ResponseCode {
    ERROR,
    Ok,
}
