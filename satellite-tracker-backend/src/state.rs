use std::sync::Arc;

use tokio::sync::RwLock;

use crate::satellite::manager::SatelliteManager;

#[derive(Clone)]
pub struct AppState {
    pub manager: Arc<RwLock<SatelliteManager>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            manager: Arc::new(RwLock::new(SatelliteManager::new())),
        }
    }
}

impl AppState {
    pub fn new() -> Self {
        Self::default()
    }
}
