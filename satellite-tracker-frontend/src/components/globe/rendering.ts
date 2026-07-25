import {
    Cartesian3,
} from "cesium";


export const VISUAL_ALTITUDE_SCALE = 3;


export function renderPosition(
    longitude: number,
    latitude: number,
    altitudeKm: number,

): Cartesian3 {

    return Cartesian3.fromDegrees(

        longitude,

        latitude,

        altitudeKm *
            VISUAL_ALTITUDE_SCALE *
            1000

    );
}
