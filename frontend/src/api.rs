use gloo_net::http::Request;
use crate::types::IssResponse;

pub async fn fetch_iss() -> IssResponse {
    Request::get("http://localhost:3000/api/iss")
        .send()
        .await
        .unwrap()
        .json::<IssResponse>()
        .await
        .unwrap()
}