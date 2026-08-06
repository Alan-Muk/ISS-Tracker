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

/*
 * Shared application state.
 *
 * This structure stores resources that must be accessible across multiple
 * request handlers. The satellite manager is wrapped in an Arc<RwLock<_>>
 * to enable safe concurrent access, allowing multiple readers while
 * synchronizing write operations.
 *
 * Default and convenience constructors are provided to initialize the
 * application state with an empty SatelliteManager.
 */
