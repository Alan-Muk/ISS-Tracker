import {
   
} from "cesium";


export interface AnimatedSatellite {

    norad_id: number;

    longitude: number;

    latitude: number;

    altitude_km: number;

    velocity_lon: number;

    velocity_lat: number;

}



export function updateSatellitePosition(
    satellite: AnimatedSatellite,
    deltaSeconds: number,
) {

    satellite.longitude +=
        satellite.velocity_lon * deltaSeconds;


    satellite.latitude +=
        satellite.velocity_lat * deltaSeconds;


    if (satellite.longitude > 180) {
        satellite.longitude -= 360;
    }

    if (satellite.longitude < -180) {
        satellite.longitude += 360;
    }

}
