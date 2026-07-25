use std::path::Path;

use tokio::fs;

use crate::tle::error::TleError;

const CACHE_FILE: &str = "data/active.tle";

pub async fn load_cache() -> Result<String, TleError> {
    fs::read_to_string(CACHE_FILE)
        .await
        .map_err(|err| TleError::Network(err.to_string()))
}

pub async fn save_cache(data: &str) -> Result<(), TleError> {
    if let Some(parent) = Path::new(CACHE_FILE).parent() {
        fs::create_dir_all(parent)
            .await
            .map_err(|err| TleError::Network(err.to_string()))?;
    }

    fs::write(CACHE_FILE, data)
        .await
        .map_err(|err| TleError::Network(err.to_string()))
}

pub fn is_valid_tle(data: &str) -> bool {
    let lines: Vec<&str> = data.lines().collect();

    lines.iter().any(|line| line.starts_with("1 "))
        && lines.iter().any(|line| line.starts_with("2 "))
}
