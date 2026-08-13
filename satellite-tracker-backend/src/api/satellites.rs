use axum::{
    Json,
    extract::{Path, Query, State},
};

use serde::{Deserialize, Serialize};

use std::collections::HashMap;

use crate::{
    orbit::{
        position::SatellitePosition, predictor::generate_prediction, propagator::propagate,
        trajectory::OrbitPrediction,
    },
    satellite::{metadata::OrbitMetadata, model::Satellite},
    state::AppState,
};

#[derive(Serialize)]
pub struct SatelliteSummary {
    pub norad_id: u32,

    pub name: String,

    pub group: String,

    pub orbit: Option<OrbitMetadata>,
}

#[derive(Debug, Deserialize)]
pub struct SatelliteFilter {
    pub group: Option<String>,

    pub orbit: Option<String>,

    pub limit: Option<usize>,
}

pub async fn list_satellites(
    State(state): State<AppState>,
    Query(filter): Query<SatelliteFilter>,
) -> Json<Vec<SatelliteSummary>> {
    let manager = state.manager.read().await;

    let mut satellites = manager.all();

    if let Some(group) = filter.group {
        satellites.retain(|satellite| satellite.group().to_string() == group);
    }

    if let Some(orbit) = filter.orbit {
        satellites.retain(|satellite| {
            satellite
                .orbit
                .as_ref()
                .map(|o| format!("{:?}", o.region))
                .unwrap_or_default()
                == orbit
        });
    }

    let limit = filter.limit.unwrap_or(500);

    satellites.truncate(limit);

    let satellites = satellites
        .into_iter()
        .map(|satellite| SatelliteSummary {
            norad_id: satellite.norad_id,

            name: satellite.name.trim().to_string(),

            group: satellite.group().to_string(),

            orbit: satellite.orbit,
        })
        .collect();

    Json(satellites)
}

pub async fn get_satellite(
    State(state): State<AppState>,
    Path(norad_id): Path<u32>,
) -> Result<Json<Satellite>, axum::http::StatusCode> {
    let manager = state.manager.read().await;

    match manager.get(norad_id) {
        Some(satellite) => Ok(Json(satellite.clone())),
        None => Err(axum::http::StatusCode::NOT_FOUND),
    }
}

pub async fn get_satellite_position(
    State(state): State<AppState>,
    Path(norad_id): Path<u32>,
) -> Result<Json<SatellitePosition>, String> {
    let manager = state.manager.read().await;

    let satellite = manager
        .get(norad_id)
        .ok_or_else(|| "Satellite not found".to_string())?;

    let position = propagate(satellite)?;

    Ok(Json(position))
}

pub async fn get_satellite_prediction(
    State(state): State<AppState>,
    Path(norad_id): Path<u32>,
) -> Result<Json<OrbitPrediction>, String> {
    let manager = state.manager.read().await;

    let satellite = manager
        .get(norad_id)
        .ok_or_else(|| "Satellite not found".to_string())?;

    let prediction = generate_prediction(satellite, 90)?;

    Ok(Json(prediction))
}

pub async fn get_satellite_groups(State(state): State<AppState>) -> Json<HashMap<String, usize>> {
    let manager = state.manager.read().await;

    let satellites = manager.all();

    let mut groups: HashMap<String, usize> = HashMap::new();

    for satellite in satellites {
        let group = satellite.group().to_string();

        *groups.entry(group).or_insert(0) += 1;
    }

    Json(groups)
}

pub async fn get_satellite_orbits(State(state): State<AppState>) -> Json<HashMap<String, usize>> {
    let manager = state.manager.read().await;

    let mut regions = HashMap::new();

    for satellite in manager.all() {
        if let Some(orbit) = &satellite.orbit {
            let region = format!("{:?}", orbit.region);

            *regions.entry(region).or_insert(0) += 1;
        }
    }

    Json(regions)
}

/*
 * HTTP handlers for the satellite API.
 *
 * This module exposes REST endpoints for querying satellite information,
 * including satellite listings, individual satellite details, current orbital
 * position, predicted trajectories, and aggregated statistics.
 *
 * Supported functionality:
 * - List satellites with optional filtering by group or orbit region and an
 *   optional result limit.
 * - Retrieve a satellite by its NORAD identifier.
 * - Compute and return the current propagated position of a satellite.
 * - Generate a short-term orbital prediction for a satellite.
 * - Return summary statistics for satellite groups.
 * - Return summary statistics for orbital regions.
 *
 * Handlers access shared application state through AppState, retrieve data
 * from the satellite manager, and return JSON responses suitable for API
 * clients.
 */
