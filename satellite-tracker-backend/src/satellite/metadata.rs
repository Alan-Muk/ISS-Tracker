use serde::{Deserialize, Serialize};


#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum OrbitRegion {

    VLEO,

    LEO,

    MEO,

    GEO,

    HEO,

    UNKNOWN,
}


impl OrbitRegion {

    pub fn from_altitude(
        altitude_km: f64
    ) -> Self {

        match altitude_km {

            0.0..=300.0 =>
                Self::VLEO,


            300.0..=2000.0 =>
                Self::LEO,


            2000.0..=35786.0 =>
                Self::MEO,


            35786.0..=50000.0 =>
                Self::GEO,


            _ =>
                Self::HEO,

        }

    }

}



#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrbitMetadata {

    pub altitude_km: f64,

    pub inclination_deg: f64,

    pub period_minutes: f64,

    pub region: OrbitRegion,

}