mod map;
mod types;

use wasm_bindgen::closure::Closure;
use wasm_bindgen::JsCast;
use web_sys::{WebSocket, MessageEvent};

use leptos::prelude::*;
use wasm_bindgen::JsValue;
use js_sys;
use serde::Deserialize;

use crate::map::{initMap, animateTo};

#[derive(Clone, Debug, Deserialize)]
struct IssResponse {
    iss_position: IssPosition,
}

#[derive(Clone, Debug, Deserialize)]
struct IssPosition {
    latitude: String,
    longitude: String,
}

#[component]
fn App() -> impl IntoView {
    let marker = create_rw_signal(None::<JsValue>);

    // Initialize map once
    create_effect(move |_| {
        let map_obj = initMap();

        let marker_obj = js_sys::Reflect::get(&map_obj, &"marker".into())
            .unwrap();

        marker.set(Some(marker_obj));
    });

    // WebSocket connection
    create_effect(move |_| {
        let marker_signal = marker.get();

        if let Some(marker_obj) = marker_signal {
            let window = web_sys::window().unwrap();
            let location = window.location();

            let protocol = if location.protocol().unwrap() == "https:" {
                "wss"
            } else {
                "ws"
            };

            let host = location.host().unwrap();
            let url = format!("{protocol}://{host}/ws");

            let ws = WebSocket::new(&url).unwrap();

            let onmessage = {
                let marker_obj = marker_obj.clone();

                Closure::<dyn FnMut(MessageEvent)>::new(move |msg: MessageEvent| {
                    if let Ok(text) = msg.data().dyn_into::<js_sys::JsString>() {
                        let parsed: Result<IssResponse, _> =
                            serde_json::from_str(&String::from(text));

                        if let Ok(data) = parsed {
                            let lat: f64 = data.iss_position.latitude.parse().unwrap();
                            let lon: f64 = data.iss_position.longitude.parse().unwrap();

                            animateTo(&marker_obj, lat, lon);
                        }
                    }
                })
            };

            ws.set_onmessage(Some(onmessage.as_ref().unchecked_ref()));
            onmessage.forget();
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
