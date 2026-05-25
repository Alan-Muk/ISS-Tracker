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

/*
========================================================
ISS API Fetch Helper
========================================================

This module provides an async function that fetches
current ISS data from the backend API.

Flow
-----
1. Send GET request to:
       http://localhost:3000/api/iss

2. Await the HTTP response

3. Deserialize the JSON response into `IssResponse`

4. Return the parsed Rust struct

Function
---------
fetch_iss()

Returns:
    IssResponse

Libraries Used
---------------
gloo_net
    Browser-compatible HTTP client for WASM/Yew apps.

serde
    Used indirectly for JSON deserialization.

crate::types::IssResponse
    Shared struct representing the ISS API response.

Important Notes
----------------
- This function uses `.unwrap()`
  which will panic if:
    - the request fails
    - the server is unreachable
    - JSON parsing fails

- In production, prefer proper error handling:
    Result<IssResponse, Error>

Example Response
-----------------
{
    "message": "success",
    "timestamp": 1712345678,
    "iss_position": {
        "latitude": "12.3456",
        "longitude": "-78.9012"
    }
}

========================================================
*/
