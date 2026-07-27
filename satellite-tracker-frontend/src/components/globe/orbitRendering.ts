import {
    Cartesian3,
} from "cesium";


import type {
    OrbitPoint,
} from "../../api";


import {
    VISUAL_ALTITUDE_SCALE,
} from "./rendering";





export function orbitPointToCartesian(

    point: OrbitPoint

): Cartesian3 {


    return Cartesian3.fromDegrees(

        point.longitude,

        point.latitude,

        point.altitude_km *

            VISUAL_ALTITUDE_SCALE *

            1000

    );

}





export function orbitPointsToCartesian(

    points: OrbitPoint[]

): Cartesian3[] {


    return points.map(

        orbitPointToCartesian

    );

}