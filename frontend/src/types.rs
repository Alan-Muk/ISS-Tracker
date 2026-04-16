use serde::Deserialize;

#[derive(Deserialize, Clone)]
pub struct IssResponse {
    pub timestamp: i64,
    pub iss_position: IssPosition,
}

#[derive(Deserialize, Clone)]
pub struct IssPosition {
    pub latitude: String,
    pub longitude: String,
}