# ISS Tracker

A real-time International Space Station (ISS) tracking application built with Rust and WebAssembly.
The system streams live ISS position updates and visualizes them on an interactive world map with smooth animations and orbital tracking.

---

#  Features

*  Live ISS position tracking in real time
*  Interactive world map using Leaflet
*  Smooth marker animation for motion realism
*  Orbit trail visualization
*  WebSocket-based real-time data updates
*  Rust-powered full-stack architecture (backend + WASM frontend)

---

#  Architecture

```text id="arch1"
Open Notify ISS API
        ↓ (HTTP polling)
Rust Backend (Axum + Tokio)
        ↓ (WebSocket stream)
Rust WASM Frontend (Leptos / wasm-bindgen)
        ↓ (JS interop)
Leaflet Map Visualization
```

---

#  Tech Stack

## Backend

* Rust
* Axum (Web framework)
* Tokio (async runtime)
* Reqwest (HTTP client)
* WebSockets (real-time streaming)
* Tower HTTP (CORS support)

---

## Frontend

* Rust (WebAssembly)
* Leptos / wasm-bindgen
* JavaScript interop (JS bindings)
* Leaflet.js (interactive mapping)
* OpenStreetMap tiles

---

#  Data Flow

```text id="flow1"
1. Backend polls Open Notify API
2. ISS coordinates are fetched every interval
3. Data is serialized into JSON
4. Sent via WebSocket stream
5. Frontend receives real-time updates
6. Marker is smoothly animated on map
```

---

#  System Overview

This system acts as a real-time geospatial telemetry pipeline:

* External API provides live ISS coordinates
* Rust backend transforms and streams data
* WebSocket maintains persistent connection
* WASM frontend renders live visualization
* Leaflet handles map rendering and animation

---

#  Key Capabilities

### Real-Time Streaming

Continuous ISS position updates via WebSocket connection.

### Geospatial Visualization

Accurate rendering of ISS movement on a global map.

### Smooth Animation System

Interpolated marker transitions for realistic motion.

### Modular Full-Stack Rust

End-to-end system built using Rust across backend and frontend.

---

#  What This Project Demonstrates

* Real-time distributed system design
* WebSocket streaming architecture
* WebAssembly frontend engineering
* Rust full-stack development
* Geospatial data visualization
* JavaScript ↔ Rust interoperability
* Event-driven system design

---

#  Future Improvements

* Add ISS trajectory prediction using orbital math
* Store historical ISS paths (time-series database)
* Add user location geofencing alerts
* Upgrade to 3D globe visualization (WebGL / Three.js)
* Add backend caching layer for API efficiency
* Introduce reconnection + resilience logic for WebSockets

---

#  License

MIT License
