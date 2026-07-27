import {
    PolylineCollection,
    Color,
} from "cesium";


import {
    useCesium,
} from "resium";


import {
    useEffect,
} from "react";


import {
    trails,
    fullOrbitTrails,
} from "./satelliteTrails";


import {
    getTrailColor,
} from "./satelliteColors";


import type {
    Satellite,
} from "../../api";





interface Props {

    satelliteData: Satellite[];

}








export default function SatelliteTrail({

    satelliteData,

}: Props) {


    const {
        scene,
    } = useCesium();






    useEffect(() => {


        if (!scene) {

            return;

        }





        const lines =

            new PolylineCollection();





        scene.primitives.add(

            lines

        );








        function updateTrails() {


            if (

                lines.isDestroyed()

            ) {

                return;

            }





            lines.removeAll();








            trails.forEach(

                (

                    points,

                    noradId

                ) => {



                    if (

                        points.length < 2

                    ) {

                        return;

                    }





                    const satellite =

                        satelliteData.find(

                            item =>

                                item.norad_id === noradId

                        );





                    const baseColor =

                        satellite

                            ? getTrailColor(
                                satellite
                            )

                            : Color.GRAY.withAlpha(
                                0.15
                            );






                    const fullOrbit =

                        fullOrbitTrails.has(

                            noradId

                        );








                    //
                    // Full atomic-style orbit
                    //

                    if (fullOrbit) {


                        lines.add({

                            positions: points,


                            width: 2,


                            material:

                                baseColor.withAlpha(
                                    0.45
                                ),


                        });



                        return;

                    }








                    //
                    // Normal motion trail
                    //

                    const recentPoints =

                        points.slice(

                            Math.max(

                                0,

                                points.length - 40

                            )

                        );





                    lines.add({


                        positions:
                            recentPoints,



                        width: 1.2,



                        material:

                            baseColor.withAlpha(
                                0.28
                            ),


                    });



                }

            );







            scene?.requestRender();


        }








        const interval =

            setInterval(

                updateTrails,

                100

            );







        return () => {



            clearInterval(

                interval

            );





            if (

                !lines.isDestroyed()

            ) {


                scene.primitives.remove(

                    lines

                );


            }


        };



    }, [

        scene,

        satelliteData,

    ]);






    return null;

}