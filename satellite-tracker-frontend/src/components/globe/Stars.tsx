import {
    useEffect,
    useRef,
} from "react";


import {
    PointPrimitiveCollection,
    Cartesian3,
    Color,
} from "cesium";


import {
    useCesium,
} from "resium";





export default function Stars() {


    const {
        scene,
    } = useCesium();



    const collection =
        useRef<PointPrimitiveCollection | null>(
            null
        );





    useEffect(() => {


        if (!scene) {

            return;

        }



        const stars =
            new PointPrimitiveCollection();




        scene.primitives.add(
            stars
        );



        collection.current =
            stars;






        for (
            let i = 0;
            i < 500;
            i++
        ) {


            stars.add({

                position:

                    Cartesian3.fromDegrees(

                        Math.random() * 360 - 180,

                        Math.random() * 180 - 90,

                        100_000_000

                    ),


                pixelSize:

                    Math.random() > 0.8

                        ? 2

                        : 1,


                color:

                    Color.WHITE.withAlpha(

                        0.6 +

                        Math.random() * 0.4

                    ),

            });


        }



        scene.requestRender();





        return () => {


            if (

                !stars.isDestroyed()

            ) {

                scene.primitives.remove(
                    stars
                );

            }


        };



    }, [

        scene,

    ]);




    return null;

}