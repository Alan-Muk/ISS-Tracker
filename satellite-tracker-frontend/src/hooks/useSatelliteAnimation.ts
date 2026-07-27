import {
    useEffect,
    useRef,
} from "react";

import {
    useCesium,
} from "resium";

import {
    SatelliteAnimator,
    type AnimatedSatellite,
} from "../components/globe/SatelliteAnimator";

import {
    renderPosition,
} from "../components/globe/rendering";

import type {
    PointPrimitive,
} from "cesium";


interface Props {

    satellites:
        AnimatedSatellite[];

    points:
        Map<number, PointPrimitive>;

}



export function useSatelliteAnimation({

    satellites,

    points,

}: Props) {


    const {
        scene,
    } = useCesium();



    const animator =
        useRef<SatelliteAnimator | null>(
            null
        );



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
                        points.get(
                            noradId
                        );


                    if (point) {

                        point.position =
                            position;

                    }

                }

            );



        let lastTime =
            performance.now();



        const tick = () => {


            const now =
                performance.now();



            const deltaSeconds =
                (
                    now -
                    lastTime
                ) / 1000;



            lastTime =
                now;



            animator.current?.update(

                satellites,

                deltaSeconds,

                renderPosition,

            );



            scene.requestRender();

        };



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

        satellites,

        points,

    ]);

}