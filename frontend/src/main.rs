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