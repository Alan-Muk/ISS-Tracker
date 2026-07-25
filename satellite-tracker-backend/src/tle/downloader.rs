use crate::tle::{cache::is_valid_tle, error::TleError};

pub async fn download_tle(url: &str) -> Result<String, TleError> {
    let client = reqwest::Client::builder()
        .user_agent("satellite-tracker/0.1")
        .build()
        .map_err(|err| TleError::Network(err.to_string()))?;

    let response = client
        .get(url)
        .header("Accept", "text/plain")
        .send()
        .await
        .map_err(|err| TleError::Network(err.to_string()))?;

    let status = response.status();

    let body = response
        .text()
        .await
        .map_err(|err| TleError::Network(err.to_string()))?;

    println!("CelesTrak status: {}", status);

    if !status.is_success() {
        if status == reqwest::StatusCode::FORBIDDEN && body.contains("has not updated") {
            return Err(TleError::Network(
                "TLE catalog unchanged. Cache required.".into(),
            ));
        }

        return Err(TleError::Network(format!("HTTP {}: {}", status, body)));
    }

    if !is_valid_tle(&body) {
        return Err(TleError::InvalidRecord);
    }

    Ok(body)
}
