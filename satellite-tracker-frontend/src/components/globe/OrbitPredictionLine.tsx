import { useMemo } from "react";

import {
    Entity,
    PolylineGraphics,
} from "resium";

import {
    Cartesian3,
    Color,
} from "cesium";


import type {
    OrbitPrediction,
} from "../../api";


interface Props {
    prediction: OrbitPrediction;
}


export default function OrbitPredictionLine({
    prediction,

}: Props) {


    const positions =
        useMemo(() => {

            if (
                !prediction?.points ||
                prediction.points.length < 2
            ) {
                return [];
            }


            return prediction.points.map(
                (point) =>

                    Cartesian3.fromDegrees(
                        point.longitude,
                        point.latitude,
                        point.altitude_km * 1000
                    )

            );


        }, [
            prediction,
        ]);



    if (
        positions.length < 2
    ) {
        return null;
    }



    return (

        <Entity>

            <PolylineGraphics

                positions={
                    positions
                }


                width={
                    1
                }


                material={
                    Color.fromCssColorString(
                        "rgba(0,200,255,0.55)"
                    )
                }


                clampToGround={
                    false
                }

            />

        </Entity>

    );
}
