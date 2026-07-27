import {
    useMemo,
} from "react";


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

    color?: Color;

    width?: number;

}





export default function OrbitLine({

    prediction,

    color = Color.CYAN.withAlpha(
        0.55
    ),

    width = 2,

}: Props) {



    const positions =
        useMemo(

            () => {


                if (

                    !prediction.points ||

                    prediction.points.length < 2

                ) {

                    return [];

                }



                return prediction.points.map(

                    point =>

                        Cartesian3.fromDegrees(

                            point.longitude,

                            point.latitude,

                            point.altitude_km * 1000

                        )

                );


            },

            [

                prediction,

            ]

        );





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
                    width
                }


                material={
                    color
                }


                clampToGround={
                    false
                }


            />


        </Entity>

    );

}