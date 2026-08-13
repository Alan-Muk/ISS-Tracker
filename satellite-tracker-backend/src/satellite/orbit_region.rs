use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OrbitRegion {
    Leo,
    Meo,
    Geo,
    Heo,
    Unknown,
}

impl OrbitRegion {
    pub fn from_altitude(altitude_km: f64) -> Self {
        if !altitude_km.is_finite() || altitude_km <= 0.0 {
            return Self::Unknown;
        }

        match altitude_km {
            0.0..=2000.0 => Self::Leo,

            2000.0..=35786.0 => Self::Meo,

            35786.0..=40000.0 => Self::Geo,

            _ => Self::Heo,
        }
    }
}

impl std::fmt::Display for OrbitRegion {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::Leo => "LEO",
                Self::Meo => "MEO",
                Self::Geo => "GEO",
                Self::Heo => "HEO",
                Self::Unknown => "UNKNOWN",
            }
        )
    }
}
