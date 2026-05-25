mod api;
mod map;
mod types;

use leptos::*;
use map::*;
use api::fetch_iss;

#[component]
fn App() -> impl IntoView {
    let marker = store_value(None::<JsValue>);

    create_effect(move |_| {
        let map_obj = initMap();
        let marker_obj = js_sys::Reflect::get(&map_obj, &"marker".into()).unwrap();
        marker.set_value(Some(marker_obj));
    });

    create_effect(move |_| {
        let marker = marker.get_value();

        if let Some(marker) = marker {
            spawn_local(async move {
                loop {
                    let resp = fetch_iss().await;

                    let lat: f64 = resp.iss_position.latitude.parse().unwrap();
                    let lon: f64 = resp.iss_position.longitude.parse().unwrap();

                    animateTo(&marker, lat, lon);

                    gloo_timers::future::sleep(std::time::Duration::from_secs(5)).await;
                }
            });
        }
    });

    view! { <div id="map"></div> }
}

fn main() {
    mount_to_body(|| view! { <App/> });
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
