use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/src/map.js")]
extern "C" {
    pub fn initMap() -> JsValue;
    pub fn animateTo(marker: &JsValue, lat: f64, lon: f64);
}

/*
========================================================
JavaScript Map Interop Bindings
========================================================

This module provides Rust bindings to JavaScript
functions defined in `map.js`.

Purpose
---------
Allows the Leptos/WASM frontend to interact with
JavaScript-based map functionality.

Technology
------------
wasm_bindgen
    Enables communication between Rust and JavaScript
    in WebAssembly applications.

Imported JavaScript Module
---------------------------
/src/map.js

Functions Exposed
------------------

initMap() -> JsValue
    Initializes the map inside the browser.

    Returns:
        A JavaScript object containing map-related
        data, including the marker instance.

    Used during application startup.

animateTo(marker, lat, lon)
    Smoothly moves the marker to a new position.

Parameters:
    marker : &JsValue
        JavaScript marker object returned from map setup.

    lat : f64
        Target latitude.

    lon : f64
        Target longitude.

How It Works
--------------
- Rust calls JavaScript through wasm_bindgen.
- JavaScript handles rendering and animations.
- Rust handles application logic and API updates.

Example Flow
--------------
1. initMap() creates the map and marker
2. Rust stores the marker reference
3. ISS coordinates are fetched from API
4. animateTo() updates marker position

========================================================
*/
