use axum::{
    extract::ws::{WebSocket, WebSocketUpgrade, Message},
    response::IntoResponse,
    routing::get,
    Router,
};
use serde::Deserialize;
use std::time::Duration;
use tower_http::cors::CorsLayer;
use tokio::time::sleep;

#[derive(Deserialize, Clone)]
struct IssResponse {
    message: String,
    timestamp: i64,
    iss_position: IssPosition,
}

#[derive(Deserialize, Clone)]
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
        if socket.is_closed() {
            break;
        }

        if let Some(data) = fetch_iss().await {
            let msg = serde_json::to_string(&data).unwrap();

            if socket
                .send(Message::Text(msg))
                .await
                .is_err()
            {
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

    println!("🚀 WebSocket server running on ws://localhost:3000/ws");

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}