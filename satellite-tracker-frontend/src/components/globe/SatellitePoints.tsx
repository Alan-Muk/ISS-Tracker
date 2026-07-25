import { useEffect, useRef } from "react";

import {
    PointPrimitiveCollection,
    Color,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
} from "cesium";

import { useCesium } from "resium";

import type {
    SatellitePosition,
} from "../../api";

import { renderPosition } from "./rendering";
import { pushTrail } from "./satelliteTrails";



interface Props {

    satellites: SatellitePosition[];

    highlightedIds: number[];

    selectedNorad: number;

    onSelect: (
        noradId: number
    ) => void;

}



export default function SatellitePoints({

    satellites,

    highlightedIds,

    selectedNorad,

    onSelect,

}: Props) {


    const {
        scene,

    } = useCesium();



    const collection =
        useRef<PointPrimitiveCollection | null>(null);





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

            (movement: any) => {


                const picked =
                    scene.pick(
                        movement.position
                    );



                if (
                    picked &&
                    picked.id &&
                    picked.id.norad_id !== undefined
                ) {

                    onSelect(
                        picked.id.norad_id
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


            collection.current =
                null;

        };


    }, [
        scene,
        onSelect,
    ]);







    useEffect(() => {


        const points =
            collection.current;



        if (
            !points ||
            points.isDestroyed()
        ) {

            return;

        }



        points.removeAll();



        satellites.forEach(
            satellite => {


                const position =
                    renderPosition(

                        satellite.longitude,

                        satellite.latitude,

                        satellite.altitude_km

                    );



                const isHighlighted =
                    highlightedIds.includes(
                        satellite.norad_id
                    );



                const isSelected =
                    satellite.norad_id === selectedNorad;





                points.add({

                    position,


                    pixelSize:

                        isSelected
                            ? 14
                            : isHighlighted
                                ? 8
                                : 4,



                    color:

                        isSelected

                            ? Color.YELLOW

                            : isHighlighted

                                ? Color.CYAN

                                : Color.GRAY,



                    id: satellite,

                });



                pushTrail(
                    satellite.norad_id,
                    position
                );


            }

        );



    }, [
        satellites,
        highlightedIds,
        selectedNorad,
    ]);



    return null;

}