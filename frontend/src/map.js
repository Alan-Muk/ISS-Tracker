// -------------------------
// Global state
// -------------------------

let map;
let marker;
let polyline;

let path = [];

// for smooth animation
let current = null;
let animationFrame = null;

// -------------------------
// Init map
// -------------------------

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

    return true;
}

// -------------------------
// Update + trail (instant mode fallback)
// -------------------------

export function updatePosition(lat, lon) {
    marker.setLatLng([lat, lon]);

    path.push([lat, lon]);

    // keep last ~200 points
    if (path.length > 200) {
        path.shift();
    }

    polyline.setLatLngs(path);
}

// -------------------------
// Smooth animation (recommended)
// -------------------------

export function animateTo(lat, lon) {
    const target = [lat, lon];

    if (!current) {
        current = target;
        marker.setLatLng(current);
        return;
    }

    const start = current;
    const end = target;

    const steps = 60;
    let i = 0;

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    function step() {
        i++;

        const t = i / steps;

        const lat = start[0] + (end[0] - start[0]) * t;
        const lon = start[1] + (end[1] - start[1]) * t;

        marker.setLatLng([lat, lon]);

        if (i < steps) {
            animationFrame = requestAnimationFrame(step);
        } else {
            current = end;

            // add to trail only when animation finishes
            path.push(end);

            if (path.length > 200) {
                path.shift();
            }

            polyline.setLatLngs(path);
        }
    }

    step();
}

// -------------------------
// Optional: auto follow ISS
// -------------------------

export function followISS() {
    if (!map || !marker) return;

    const pos = marker.getLatLng();
    if (pos) {
        map.setView(pos, map.getZoom());
    }
}

// -------------------------
// WebSocket helper (frontend side)
// -------------------------

export function connectWS(onMessage) {
    const ws = new WebSocket("ws://localhost:3000/ws");

    ws.onopen = () => {
        console.log("WS connected 🛰️");
    };

    ws.onmessage = (event) => {
        onMessage(event.data);
    };

    ws.onerror = (err) => {
        console.error("WS error:", err);
    };

    ws.onclose = () => {
        console.warn("WS closed");
    };

    return ws;
}