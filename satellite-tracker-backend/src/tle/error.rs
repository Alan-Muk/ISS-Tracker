use thiserror::Error;

#[derive(Debug, Error)]
pub enum TleError {
    #[error("input is empty")]
    EmptyInput,

    #[error("invalid TLE record")]
    InvalidRecord,

    #[error("network error: {0}")]
    Network(String),

    #[error("invalid server response")]
    InvalidResponse,
}
