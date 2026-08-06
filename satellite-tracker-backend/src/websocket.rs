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

/*
 * WebSocket connection handler.
 *
 * Establishes a WebSocket connection with a client and maintains the session
 * by periodically sending a simple status message every five seconds.
 *
 * The connection remains active until the client disconnects or a send
 * operation fails, at which point the handler exits and the session is
 * terminated. This implementation provides a basic foundation for real-time
 * communication and can be extended to stream live satellite updates or other
 * server-generated events.
 */
