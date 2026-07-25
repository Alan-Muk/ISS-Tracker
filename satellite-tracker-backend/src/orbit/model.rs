use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct SatellitePosition {
    pub norad_id: u32,
    pub latitude: f64,
    pub longitude: f64,
    pub altitude_km: f64,
    pub timestamp: i64,
}
