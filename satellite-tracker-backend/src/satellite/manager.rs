use std::collections::HashMap;

use super::model::Satellite;

#[derive(Default)]
pub struct SatelliteManager {
    satellites: HashMap<u32, Satellite>,
}

impl SatelliteManager {
    pub fn new() -> Self {
        Self {
            satellites: HashMap::new(),
        }
    }

    pub fn insert(&mut self, satellite: Satellite) {
        self.satellites.insert(satellite.norad_id, satellite);
    }

    pub fn insert_many(&mut self, satellites: Vec<Satellite>) {
        for satellite in satellites {
            self.insert(satellite);
        }
    }

    pub fn get(&self, norad_id: u32) -> Option<&Satellite> {
        self.satellites.get(&norad_id)
    }

    pub fn all(&self) -> Vec<Satellite> {
        self.satellites.values().cloned().collect()
    }

    pub fn count(&self) -> usize {
        self.satellites.len()
    }
}
