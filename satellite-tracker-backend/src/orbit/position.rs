use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct SatellitePosition {
    pub norad_id: u32,
    pub latitude: f64,
    pub longitude: f64,
    pub altitude_km: f64,
    pub velocity_km_s: f64,
    pub timestamp: DateTime<Utc>,
}
