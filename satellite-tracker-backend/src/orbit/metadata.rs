use sgp4::Elements;

use crate::satellite::metadata::OrbitMetadata;
use crate::satellite::metadata::OrbitRegion;

const EARTH_RADIUS_KM: f64 = 6378.137;

const MU: f64 = 398600.4418;

pub fn calculate_metadata(name: &str, line1: &str, line2: &str) -> Result<OrbitMetadata, String> {
    let elements = Elements::from_tle(Some(name.to_string()), line1.as_bytes(), line2.as_bytes())
        .map_err(|e| e.to_string())?;

    let inclination_deg = elements.inclination.to_degrees();

    let period_minutes = 1440.0 / elements.mean_motion;

    //
    // Mean motion:
    // revolutions/day
    //
    // Convert to radians/sec
    //
    let mean_motion_rad_s = elements.mean_motion * 2.0 * std::f64::consts::PI / 86400.0;

    //
    // Kepler:
    //
    // a = cube_root(mu / n²)
    //
    let semi_major_axis_km = (MU / mean_motion_rad_s.powi(2)).powf(1.0 / 3.0);

    let altitude_km = semi_major_axis_km - EARTH_RADIUS_KM;

    Ok(OrbitMetadata {
        altitude_km,

        inclination_deg,

        period_minutes,

        region: OrbitRegion::from_altitude(altitude_km),
    })
}
