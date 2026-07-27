import {
    useCallback,
} from "react";


import {
    Cartesian3,
} from "cesium";


import {
    useCesium,
} from "resium";


import {
    VISUAL_ALTITUDE_SCALE,
} from "../components/globe/rendering";


import type {
    OrbitRegion,
} from "../api";



const regionAltitudes: Record<OrbitRegion, number> = {

    VLEO: 150,

    LEO: 800,

    MEO: 10000,

    GEO: 35786,

    HEO: 20000,

    UNKNOWN: 0,

};





export function useOrbitCamera() {


    const {
        viewer,
    } = useCesium();




    const flyToRegion =
        useCallback(

            (
                region: OrbitRegion
            ) => {


                if (!viewer) {

                    return;

                }



                const altitudeKm =
                    regionAltitudes[region];



                if (!altitudeKm) {

                    return;

                }



                viewer.camera.flyTo({

                    destination:

                        Cartesian3.fromDegrees(

                            0,

                            0,

                            (

                                6378137 +

                                (

                                    altitudeKm *

                                    VISUAL_ALTITUDE_SCALE *

                                    1000

                                )

                            ) * 2

                        ),


                    duration:
                        2,

                });


            },

            [

                viewer,

            ]

        );



    return {

        flyToRegion,

    };

}