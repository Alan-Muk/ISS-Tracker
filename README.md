# ISS Real-Time Tracking System

![Rust](https://img.shields.io/badge/Rust-1.89-000000?logo=rust)
![Axum](https://img.shields.io/badge/Axum-Web_Server-000000)
![WebAssembly](https://img.shields.io/badge/WebAssembly-WASM-654FF0?logo=webassembly)
![WebSockets](https://img.shields.io/badge/Protocol-WebSockets-blue)
![Leaflet](https://img.shields.io/badge/Leaflet-Interactive_Map-199900?logo=leaflet)
![License](https://img.shields.io/badge/License-MIT-green)

A real-time International Space Station tracking platform built with Rust, WebSockets, and WebAssembly.

The system collects live ISS telemetry, streams position updates through an asynchronous backend, and renders the station's movement on an interactive global map with smooth real-time animation.

---

# Overview

ISS Tracker is a full-stack real-time geospatial application designed around continuous data streaming.

The system workflow:

```text
Open Notify ISS API
          |
          ↓
Rust Async Backend
          |
          ↓
WebSocket Data Stream
          |
          ↓
Rust WebAssembly Client
          |
          ↓
Leaflet Map Renderer
          |
          ↓
Live ISS Visualization
```

The project demonstrates how real-time telemetry can be collected, processed, transmitted, and visualized using modern systems programming technologies.

---

# Problem

Real-time location systems require more than periodic data fetching.

A reliable tracking system must handle:

- Continuous data updates
- Low-latency communication
- State synchronization
- Smooth visualization
- Network interruptions

ISS Tracker explores how event-driven architectures can be used to build responsive real-time applications.

---

# Architecture

## System Architecture

```text
                 ISS API

                   |
                   ↓

          Rust Backend (Axum)

                   |
                   ↓

        WebSocket Communication

                   |
                   ↓

      Rust WASM Frontend Client

                   |
                   ↓

          Leaflet Visualization
```

---

# Components

## Backend

Built using Rust and Axum.

Responsibilities:

- Poll ISS telemetry data
- Process incoming coordinates
- Serialize location updates
- Broadcast updates through WebSockets

Technologies:

- Rust
- Axum
- Tokio
- Reqwest
- Tower HTTP

---

## Real-Time Communication Layer

The system uses WebSockets to maintain a persistent connection between backend and frontend.

Data flow:

```text
ISS Position Update

        ↓

JSON Serialization

        ↓

WebSocket Broadcast

        ↓

Frontend State Update
```

Benefits:

- Low latency updates
- Continuous streaming
- Reduced polling overhead
- Real-time synchronization

---

## WebAssembly Frontend

The frontend runs Rust code compiled to WebAssembly.

Responsibilities:

- Receive telemetry updates
- Manage client-side state
- Communicate with JavaScript APIs
- Update map visualization

Technologies:

- Rust WASM
- Leptos / wasm-bindgen
- JavaScript interoperability
- Leaflet.js

---

# Core Features

## Live ISS Position Tracking

- Fetches current ISS coordinates
- Streams updates in real time
- Displays current orbital position

---

## Interactive World Map

The visualization includes:

- Global map rendering
- ISS location marker
- Geographic positioning
- Movement tracking

---

## Smooth Motion Animation

Instead of jumping between coordinates, the frontend interpolates movement.

This provides:

- Smoother transitions
- More realistic motion
- Better user experience

---

## Orbit Trail Visualization

The application tracks previous ISS positions to display movement history.

This provides:

- Visual trajectory representation
- Motion context
- Orbital path awareness

---

# Data Flow

```text
1. Backend requests ISS coordinates

2. ISS location is received

3. Backend converts data into JSON

4. WebSocket broadcasts update

5. WASM client receives message

6. Frontend updates map state

7. Leaflet animates marker movement
```

---

# Technical Highlights

- Built an asynchronous Rust backend
- Designed WebSocket-based streaming architecture
- Implemented Rust-to-JavaScript interoperability
- Created a WebAssembly-powered frontend
- Built a real-time geospatial visualization system
- Managed continuous event-driven updates

---

# Design Decisions

## WebSocket Streaming

Traditional polling creates unnecessary repeated requests.

WebSockets provide:

- Persistent communication
- Lower latency
- Efficient updates

---

## Rust Full-Stack Architecture

Using Rust across backend and frontend provides:

- Shared language ecosystem
- Strong type safety
- High-performance execution

---

## Client-Side Rendering

The backend focuses on:

- Data retrieval
- Streaming
- Communication

The frontend handles:

- Visualization
- Animation
- User interaction

This keeps responsibilities separated.

---

# System Characteristics

## Event-Driven Design

The system follows an event flow:

```text
New ISS Position

        ↓

Backend Event

        ↓

WebSocket Message

        ↓

Frontend Update

        ↓

Visual Transition
```

---

## Real-Time Requirements

The system prioritizes:

- Fast updates
- Smooth rendering
- Reliable communication
- Efficient data transfer

---

# Example Applications

- Satellite tracking systems
- IoT telemetry dashboards
- Real-time monitoring platforms
- Geospatial applications
- Event-driven architectures

---

# Challenges

## Maintaining Smooth Motion

Raw GPS-style updates can appear discontinuous.

Solution:

- Client-side interpolation
- Animated transitions

---

## Real-Time Communication

Persistent connections require careful handling.

Solution:

- WebSocket streaming
- Async backend architecture

---

## Browser and Rust Integration

WebAssembly introduces communication boundaries.

Solution:

- wasm-bindgen interfaces
- JavaScript interoperability

---

# Future Improvements

- Add orbital trajectory prediction
- Store historical ISS paths using time-series storage
- Add user location notifications
- Implement WebSocket reconnection strategies
- Add backend caching layer
- Upgrade to 3D globe rendering with WebGL / Three.js
- Add multiple satellite tracking

---

# License

MIT License
