use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use tokio::time::{sleep, Duration};
use tower_http::cors::CorsLayer;

#[derive(Deserialize, Serialize, Clone)]
struct IssResponse {
    message: String,
    timestamp: i64,
    iss_position: IssPosition,
}

#[derive(Deserialize, Serialize, Clone)]
struct IssPosition {
    latitude: String,
    longitude: String,
}

async fn fetch_iss() -> Option<IssResponse> {
    reqwest::get("http://api.open-notify.org/iss-now.json")
        .await
        .ok()?
        .json::<IssResponse>()
        .await
        .ok()
}

async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    loop {
        if let Some(data) = fetch_iss().await {
            let msg = match serde_json::to_string(&data) {
                Ok(m) => m,
                Err(_) => continue,
            };

            if socket.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }

        sleep(Duration::from_secs(2)).await;
    }
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/ws", get(ws_handler))
        .layer(CorsLayer::permissive());

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string());

    let addr = format!("0.0.0.0:{port}");

    println!("🚀 WebSocket server running on ws://{addr}/ws");

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("failed to bind address");

    axum::serve(listener, app)
        .await
        .expect("server failed");
}
/*
========================================================
ISS WebSocket Server Overview
========================================================

This server uses Axum and Tokio to provide a WebSocket
endpoint that streams live ISS location data to clients.

Flow:
1. Client connects to `/ws`
2. HTTP connection upgrades to WebSocket
3. Server fetches ISS coordinates every 2 seconds
4. JSON data is sent to connected clients in real time

Main Components
----------------

IssResponse
    Represents the JSON structure returned by:
    http://api.open-notify.org/iss-now.json

IssPosition
    Stores latitude and longitude values for the ISS.

fetch_iss()
    Sends an HTTP request to the ISS API using reqwest.
    Returns:
        Some(IssResponse) on success
        None on failure

ws_handler()
    Handles incoming WebSocket upgrade requests.

handle_socket()
    Runs an infinite async loop that:
        - checks if the socket is still connected
        - fetches fresh ISS data
        - serializes it into JSON
        - sends it through the WebSocket
        - waits 2 seconds before repeating

main()
    Configures and starts the Axum server.
    WebSocket endpoint:
        ws://localhost:3000/ws

Libraries Used
----------------
axum        -> Web framework + WebSocket support
tokio       -> Async runtime
reqwest     -> HTTP client
serde       -> JSON deserialization
tower_http  -> CORS middleware

Example WebSocket Message
--------------------------
{
    "message": "success",
    "timestamp": 1712345678,
    "iss_position": {
        "latitude": "34.1234",
        "longitude": "-118.5678"
    }
}

========================================================
*/
