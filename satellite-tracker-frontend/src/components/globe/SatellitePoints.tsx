import {
    useEffect,
    useRef,
} from "react";


import {
    PointPrimitiveCollection,
    PointPrimitive,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
} from "cesium";


import {
    useCesium,
} from "resium";

import {
    Cartesian2,
} from "cesium";

import type {
    Satellite,
    SatellitePosition,
} from "../../api";


import type {
    AnimatedSatellite,
} from "./SatelliteAnimator";


import {
    SatelliteAnimator,
} from "./SatelliteAnimator";


import {
    renderPosition,
} from "./rendering";


import SatellitePointLayer from "./SatellitePointLayer";

import {
    pushTrail,
} from "./satelliteTrails";


import {
    Cartesian3,
} from "cesium";


import {
    trails,
} from "./satelliteTrails";

interface Props {

    satellites: SatellitePosition[];

    satelliteData: Satellite[];

    highlightedIds: number[];

    selectedNorad: number | null;

    onSelect: (
        noradId: number
    ) => void;

}







export default function SatellitePoints({

    satellites,

    satelliteData,

    highlightedIds,

    selectedNorad,

    onSelect,

}: Props) {


    const {
        scene,

    } = useCesium();





    const collection =

        useRef<PointPrimitiveCollection | null>(null);





    const pointMap =

        useRef<Map<number, PointPrimitive>>(

            new Map()

        );





    const animatedSatellites =

        useRef<AnimatedSatellite[]>([]);





    const animator =

        useRef<SatelliteAnimator | null>(null);









    //
    // Create Cesium point collection
    //
    useEffect(() => {


        if (!scene) {

            return;

        }





        const points =

            new PointPrimitiveCollection();





        scene.primitives.add(

            points

        );





        collection.current =

            points;







        const handler =

            new ScreenSpaceEventHandler(

                scene.canvas

            );







handler.setInputAction(

    (movement: {
        position: Cartesian2;
    }) => {


        const picked =

            scene.pick(

                movement.position

            );



        const pickedSatellite =

            picked?.id as SatellitePosition | undefined;



        if (

            pickedSatellite?.norad_id !== undefined

        ) {


            onSelect(

                pickedSatellite.norad_id

            );


        }


    },


    ScreenSpaceEventType.LEFT_CLICK

);








        return () => {


            handler.destroy();





            if (

                !points.isDestroyed()

            ) {


                scene.primitives.remove(

                    points

                );


            }





            pointMap.current.clear();


            collection.current = null;



        };



    }, [

        scene,

        onSelect,

    ]);









    //
    // Animation loop
    //
    useEffect(() => {


        if (!scene) {

            return;

        }





animator.current =

    new SatelliteAnimator(

        (

            noradId,

            position,

        ) => {


            const point =

                pointMap.current.get(

                    noradId

                );




            if (point) {

                point.position =

                    position;

            }



            const trail =

                trails.get(

                    noradId

                );



            const last =

                trail?.[

                    trail.length - 1

                ];



            if (

                !last ||

                !Cartesian3.equals(

                    last,

                    position

                )

            ) {

                pushTrail(

                    noradId,

                    position

                );

            }


        }

    );







        let lastTime =

            performance.now();






        function tick() {



            const now =

                performance.now();





            const deltaSeconds =

                (

                    now - lastTime

                ) / 1000;





            lastTime = now;







            animator.current?.update(

                animatedSatellites.current,


                deltaSeconds,


                renderPosition,

            );






            scene?.requestRender();


        }







        scene.postRender.addEventListener(

            tick

        );







        return () => {


            scene.postRender.removeEventListener(

                tick

            );


        };



    }, [

        scene,

    ]);


    return (

    <SatellitePointLayer

        satellites={satellites}

        satelliteData={satelliteData}

        highlightedIds={highlightedIds}

        selectedNorad={selectedNorad}

        collection={collection}

        pointMap={pointMap}

        animatedSatellites={animatedSatellites}

    />

    );

}