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

/*
 * SatelliteResponse is the API-facing representation of a Satellite.
 *
 * It exposes only the fields required by clients (NORAD ID, name, and group),
 * keeping the internal Satellite model decoupled from the serialized response.
 *
 * Conversion implementations are provided for both owned (Satellite) and
 * borrowed (&Satellite) values, allowing flexible response creation while
 * avoiding unnecessary ownership transfers where possible.
 */
