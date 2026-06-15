mod api;
mod map;
mod types;

use leptos::prelude::*;
use wasm_bindgen::JsValue;
use wasm_bindgen::JsCast;
use js_sys;

use leptos::task::spawn_local;

use api::fetch_iss;
use map::{initMap, animateTo};

#[component]
fn App() -> impl IntoView {
    // Leptos 0.8 signal (NO tuple destructuring)
    let marker = create_rw_signal(None::<JsValue>);

    // Initialize map once
    create_effect(move |_| {
        let map_obj = initMap();

        // Safe JS interop: get "marker" field from JS object
        let marker_obj = js_sys::Reflect::get(&map_obj, &"marker".into())
            .unwrap();

        marker.set(Some(marker_obj));
    });

    // ISS update loop
    create_effect(move |_| {
        let marker_signal = marker.get();

        if let Some(marker_obj) = marker_signal {
            spawn_local(async move {
                loop {
                    // fetch ISS position (NOT Result anymore)
                    let resp = fetch_iss().await;

                    let lat: f64 = resp.iss_position.latitude.parse().unwrap();
                    let lon: f64 = resp.iss_position.longitude.parse().unwrap();

                    animateTo(&marker_obj, lat, lon);

                    // 5 second delay (no gloo future feature required)
                    gloo_timers::callback::Timeout::new(5000, || {}).forget();
                }
            });
        }
    });

    view! {
        <div id="map" style="height: 100vh; width: 100%;"></div>
    }
}

fn main() {
    mount_to_body(App);
}
/*
========================================================
Leptos ISS Tracker Frontend
========================================================

This frontend application displays the live position
of the International Space Station (ISS) on a map.

Built With
------------
Leptos          -> Reactive Rust web framework
WASM            -> Runs Rust in the browser
Gloo            -> Browser utilities + async helpers
JavaScript Map  -> External JS map integration

Modules
---------
api
    Handles HTTP requests to the backend API.

map
    Contains JavaScript interop functions for
    initializing and animating the map marker.

types
    Shared Rust structs for ISS API responses.

Application Flow
-----------------
1. App component mounts
2. JavaScript map is initialized
3. Marker object is extracted and stored
4. Async loop continuously:
       - fetches ISS coordinates
       - parses latitude/longitude
       - animates marker movement
       - waits 5 seconds
       - repeats

Main Components
----------------

store_value()
    Stores reactive state outside the DOM.

create_effect()
    Runs reactive side effects whenever dependencies
    change or when the component initializes.

spawn_local()
    Launches async tasks in the browser runtime.

fetch_iss()
    Retrieves latest ISS position data from backend API.

animateTo()
    Moves the map marker smoothly to new coordinates.

Important Notes
----------------
- Latitude and longitude are received as strings
  and parsed into f64 values.

- `.unwrap()` is used heavily and may panic if:
      - API response is invalid
      - coordinates fail to parse
      - JS interop fails

- In production applications, replace unwraps
  with proper error handling.

DOM Output
------------
Renders:
    <div id="map"></div>

The external JavaScript map library attaches itself
to this element.

Program Entry
---------------
main()
    Mounts the App component into the document body.

========================================================
*/
