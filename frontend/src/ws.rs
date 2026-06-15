use serde::Deserialize;
use wasm_bindgen::JsValue;
use wasm_bindgen::JsCast;
use web_sys::WebSocket;
use leptos::prelude::*;
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Clone, Debug, Deserialize)]
pub struct IssResponse {
    pub iss_position: IssPosition,
}

#[derive(Clone, Debug, Deserialize)]
pub struct IssPosition {
    pub latitude: String,
    pub longitude: String,
}

pub fn connect_ws(
    on_message: impl Fn(IssResponse) + 'static,
) {
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

    ws.set_binary_type(web_sys::BinaryType::Text);

    let callback = Closure::<dyn FnMut(_)>::new(move |msg: web_sys::MessageEvent| {
        if let Ok(text) = msg.data().dyn_into::<js_sys::JsString>() {
            let parsed: Result<IssResponse, _> = serde_json::from_str(&String::from(text));

            if let Ok(data) = parsed {
                on_message(data);
            }
        }
    });

    ws.set_onmessage(Some(callback.as_ref().unchecked_ref()));
    callback.forget();
}