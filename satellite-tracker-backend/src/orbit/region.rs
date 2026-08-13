use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "UPPERCASE")]
pub enum OrbitRegion {
    LEO,

    MEO,

    GEO,

    HEO,

    UNKNOWN,
}

impl OrbitRegion {
    pub fn from_altitude(altitude_km: f64) -> Self {
        match altitude_km {
            0.0..=2000.0 => Self::LEO,

            2000.0..=35000.0 => Self::MEO,

            35000.0..=40000.0 => Self::GEO,

            40000.0.. => Self::HEO,

            _ => Self::UNKNOWN,
        }
    }
}

impl std::fmt::Display for OrbitRegion {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::LEO => "LEO",
                Self::MEO => "MEO",
                Self::GEO => "GEO",
                Self::HEO => "HEO",
                Self::UNKNOWN => "UNKNOWN",
            }
        )
    }
}
