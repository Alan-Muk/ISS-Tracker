use chrono::{DateTime, Utc};
use sgp4::{Constants, Elements};

use crate::{orbit::position::SatellitePosition, satellite::model::Satellite};

pub fn propagate(satellite: &Satellite) -> Result<SatellitePosition, String> {
    propagate_at(satellite, Utc::now())
}

pub fn propagate_at(
    satellite: &Satellite,
    timestamp: DateTime<Utc>,
) -> Result<SatellitePosition, String> {
    let elements = Elements::from_tle(
        Some(satellite.name.clone()),
        satellite.line1.as_bytes(),
        satellite.line2.as_bytes(),
    )
    .map_err(|e| e.to_string())?;

    let constants = Constants::from_elements(&elements).map_err(|e| e.to_string())?;

    let minutes = elements
        .datetime_to_minutes_since_epoch(&timestamp.naive_utc())
        .map_err(|e| e.to_string())?;

    let prediction = constants.propagate(minutes).map_err(|e| e.to_string())?;

    let position = prediction.position;
    let velocity = prediction.velocity;

    let x = position[0];
    let y = position[1];
    let z = position[2];

    let longitude = y.atan2(x).to_degrees();

    let latitude = z.atan2((x * x + y * y).sqrt()).to_degrees();

    let altitude_km = (x * x + y * y + z * z).sqrt() - 6371.0;

    let velocity_km_s = (velocity[0].powi(2) + velocity[1].powi(2) + velocity[2].powi(2)).sqrt();

    Ok(SatellitePosition {
        norad_id: satellite.norad_id,
        latitude,
        longitude,
        altitude_km,
        velocity_km_s,
        timestamp,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn propagates_iss_position() {
        let satellite = Satellite {
            norad_id: 25544,
            name: "ISS (ZARYA)".to_string(),
            line1: "1 25544U 98067A   26203.79832414  .00009714  00000+0  18351-3 0  9992"
                .to_string(),
            line2: "2 25544  51.6313 123.8641 0006897 326.7338  33.3216 15.49102905577270"
                .to_string(),
        };

        let position =
            propagate(&satellite).unwrap_or_else(|error| panic!("Propagation failed: {error}"));

        assert_eq!(position.norad_id, 25544);
        assert!(position.velocity_km_s > 7.0);
    }
}
