use serde::Deserialize;

#[derive(Deserialize, Clone)]
pub struct IssResponse {
    pub timestamp: i64,
    pub iss_position: IssPosition,
}

#[derive(Deserialize, Clone)]
pub struct IssPosition {
    pub latitude: String,
    pub longitude: String,
}

/*
========================================================
ISS Response Data Structures
========================================================

These structs represent the JSON response returned
by the backend/API containing the current position
of the International Space Station (ISS).

Purpose
---------
Used for deserializing JSON data into strongly typed
Rust structures using Serde.

Library Used
--------------
serde::Deserialize
    Automatically converts JSON into Rust structs.

Structs
---------

IssResponse
-------------
Represents the main API response object.

Fields:
    timestamp : i64
        Unix timestamp indicating when the ISS
        position was recorded.

    iss_position : IssPosition
        Nested object containing latitude and longitude.

IssPosition
-------------
Represents the ISS coordinate data.

Fields:
    latitude : String
        ISS latitude value.

    longitude : String
        ISS longitude value.

Why Coordinates Are Strings
----------------------------
The external ISS API returns coordinates as strings,
so the fields are stored as String and later parsed
into f64 values when needed for calculations or maps.

Example JSON
--------------
{
    "timestamp": 1712345678,
    "iss_position": {
        "latitude": "51.2345",
        "longitude": "-0.1234"
    }
}

Traits Derived
----------------
Deserialize
    Enables JSON parsing with Serde.

Clone
    Allows structs to be duplicated when needed.

========================================================
*/
