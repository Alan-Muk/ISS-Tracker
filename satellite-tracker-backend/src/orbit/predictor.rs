use chrono::{Duration, Utc};

use crate::{
    orbit::{
        position::SatellitePosition,
        propagator::propagate_at,
        trajectory::OrbitPrediction,
    },
    satellite::model::Satellite,
};

pub fn generate_prediction(
    satellite: &Satellite,
    minutes: u32,
) -> Result<OrbitPrediction, String> {
    let mut points: Vec<SatellitePosition> = Vec::new();
    let start = Utc::now();

    let step_seconds: u32 = 60;

    for i in 0..minutes {
        let timestamp = start
            + Duration::seconds(i as i64 * step_seconds as i64);

        points.push(
            propagate_at(satellite, timestamp)?
        );
    }

    Ok(OrbitPrediction {
        norad_id: satellite.norad_id,
        generated_at: start,
        duration_minutes: minutes,
        step_seconds,
        points,
    })
}
