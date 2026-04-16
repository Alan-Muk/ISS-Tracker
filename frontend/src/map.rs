use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/src/map.js")]
extern "C" {
    pub fn initMap() -> JsValue;
    pub fn animateTo(marker: &JsValue, lat: f64, lon: f64);
}