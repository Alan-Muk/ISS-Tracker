let map;
let marker;
let polyline;

let path = [];

export function initMap() {
    map = L.map("map").setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(map);

    marker = L.marker([0, 0]).addTo(map);

    polyline = L.polyline([], {
        color: "red",
        weight: 2
    }).addTo(map);

    return marker;
}

export function updatePosition(lat, lon) {
    marker.setLatLng([lat, lon]);

    path.push([lat, lon]);

    if (path.length > 200) {
        path.shift();
    }

    polyline.setLatLngs(path);
}

export function animateTo(marker, lat, lon) {
    marker.setLatLng([lat, lon]);
}

export function connectWS(onMessage) {
    const ws = new WebSocket("ws://localhost:3000/ws");

    ws.onmessage = (event) => {
        onMessage(event.data);
    };

    return ws;
}