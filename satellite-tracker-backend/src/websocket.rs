use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
};

pub async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    loop {
        let msg = r#"{"status":"connected"}"#.to_string();

        if socket.send(Message::Text(msg.into())).await.is_err() {
            break;
        }

        tokio::time::sleep(std::time::Duration::from_secs(5)).await;
    }
}
