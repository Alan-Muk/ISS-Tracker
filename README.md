
 Features

-  Live ISS position tracking
-  Interactive world map (Leaflet)
-  Smooth marker animation
-  Orbit trail visualization
-  WebSocket-based real-time updates
-  Rust-powered backend + frontend (WASM)

---

 Architecture

Frontend (Rust WASM + Leaflet)
↓ WebSocket
Backend (Axum)
↓ HTTP fetch
Open Notify API
Open Notify API


---

 Tech Stack

Backend
- Rust
- Axum (Web framework)
- Tokio (async runtime)
- Reqwest (HTTP client)
- WebSockets (real-time streaming)
- CORS support

 Frontend
 
- Rust (WASM)
- Leptos / wasm-bindgen
- JavaScript interop
- Leaflet.js for mapping
- OpenStreetMap tiles


