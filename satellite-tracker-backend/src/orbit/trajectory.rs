use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::orbit::position::SatellitePosition;

#[derive(Debug, Serialize)]
pub struct OrbitPrediction {
    pub norad_id: u32,
    pub generated_at: DateTime<Utc>,
    pub duration_minutes: u32,
    pub step_seconds: u32,
    pub points: Vec<SatellitePosition>,
}
