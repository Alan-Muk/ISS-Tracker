use satellite_tracker_backend::{
    routes, satellite::loader::load_active_satellites, state::AppState,
};

#[tokio::main]
async fn main() {
    let state = AppState::new();

    {
        let mut manager = state.manager.write().await;

        match load_active_satellites(&mut manager).await {
            Ok(count) => {
                println!("🛰️ Loaded {} satellites", count);
            }

            Err(err) => {
                eprintln!("Failed loading satellites: {}", err);
            }
        }
    }

    let app = routes::create_router(state);

    let addr = "0.0.0.0:3000";

    println!("🚀 Server running on http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind address");

    axum::serve(listener, app).await.expect("server failed");
}

/*
 * Application entry point.
 *
 * Initializes the shared application state, loads the active satellite dataset,
 * configures the HTTP router, and starts the Axum web server.
 *
 * On startup, the application attempts to populate the satellite manager with
 * the latest available satellite data, reporting the outcome to the console.
 * Once initialization is complete, it binds to the configured network address
 * and begins serving incoming API requests.
 */
