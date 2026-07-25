use serde::Serialize;

use crate::satellite::{
    group::SatelliteGroup,
    model::Satellite,
};

#[derive(Debug, Serialize)]
pub struct SatelliteResponse {
    pub norad_id: u32,
    pub name: String,
    pub group: SatelliteGroup,
}

impl From<Satellite> for SatelliteResponse {
    fn from(satellite: Satellite) -> Self {
        let group = satellite.group();

        Self {
            norad_id: satellite.norad_id,
            name: satellite.name,
            group,
        }
    }
}

impl From<&Satellite> for SatelliteResponse {
    fn from(satellite: &Satellite) -> Self {
        Self {
            norad_id: satellite.norad_id,
            name: satellite.name.clone(),
            group: satellite.group(),
        }
    }
}
