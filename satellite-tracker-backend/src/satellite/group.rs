use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SatelliteGroup {
    Starlink,
    OneWeb,
    Iss,
    Gps,
    Weather,
    Iridium,
    Debris,
    Other,
}

impl SatelliteGroup {
    pub fn from_name(name: &str) -> Self {
        let name = name.to_uppercase();

        if name.contains("STARLINK") {
            Self::Starlink
        } else if name.contains("ONEWEB") {
            Self::OneWeb
        } else if name.contains("ISS") || name.contains("ZARYA") || name.contains("ZVEZDA") {
            Self::Iss
        } else if name.contains("GPS") || name.contains("NAVSTAR") {
            Self::Gps
        } else if name.contains("NOAA") || name.contains("WEATHER") {
            Self::Weather
        } else if name.contains("IRIDIUM") {
            Self::Iridium
        } else if name.contains("DEB") || name.contains("R/B") || name.contains("BODY") {
            Self::Debris
        } else {
            Self::Other
        }
    }

    pub fn color(&self) -> &'static str {
        match self {
            Self::Starlink => "#00aaff",
            Self::OneWeb => "#4488ff",
            Self::Iss => "#ffaa00",
            Self::Gps => "#aa00ff",
            Self::Weather => "#00ff88",
            Self::Iridium => "#ff44aa",
            Self::Debris => "#888888",
            Self::Other => "#ffffff",
        }
    }

    pub fn default_limit(&self) -> usize {
        match self {
            Self::Starlink => 50,
            Self::Debris => 25,
            Self::Iss => 10,
            _ => 30,
        }
    }

    pub fn all() -> &'static [Self] {
        &[
            Self::Starlink,
            Self::OneWeb,
            Self::Iss,
            Self::Gps,
            Self::Weather,
            Self::Iridium,
            Self::Debris,
            Self::Other,
        ]
    }
}

impl fmt::Display for SatelliteGroup {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::Starlink => "STARLINK",
                Self::OneWeb => "ONEWEB",
                Self::Iss => "ISS",
                Self::Gps => "GPS",
                Self::Weather => "WEATHER",
                Self::Iridium => "IRIDIUM",
                Self::Debris => "DEBRIS",
                Self::Other => "OTHER",
            }
        )
    }
}
