import {
    Color,
    Cartesian3,
    Cartesian2,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
} from "cesium";

import {
    Entity,
    EllipsoidGraphics,
    useCesium,
} from "resium";

import {
    useEffect,
    useRef,
} from "react";

import {
    VISUAL_ALTITUDE_SCALE,
} from "./rendering";

import type {
    OrbitRegion,
} from "../../api";



interface Props {

    selectedRegion: OrbitRegion | "ALL";

    onSelectRegion: (
        region: OrbitRegion | "ALL"
    ) => void;

}



interface Region {

    name: OrbitRegion;

    altitudeKm: number;

    color: string;

}



const regions: Region[] = [

    {
        name: "VLEO",
        altitudeKm: 150,
        color: "#00ffff",
    },

    {
        name: "LEO",
        altitudeKm: 800,
        color: "#0088ff",
    },

    {
        name: "MEO",
        altitudeKm: 10000,
        color: "#aa00ff",
    },

    {
        name: "GEO",
        altitudeKm: 35786,
        color: "#ff8800",
    },

];





export default function OrbitRegions({

    selectedRegion,

    onSelectRegion,

}: Props) {


    const {
        scene,
        viewer,

    } = useCesium();



    const handler =
        useRef<ScreenSpaceEventHandler | null>(null);





    function flyToRegion(
        regionName: OrbitRegion
    ) {


        if (!viewer) {
            return;
        }



        const region =
            regions.find(
                item =>
                    item.name === regionName
            );



        if (!region) {
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
                            region.altitudeKm *
                            VISUAL_ALTITUDE_SCALE *
                            1000
                        )
                    ) * 2

                ),

            duration: 2,

        });

    }







    //
    // Allow selector changes to move camera
    //
    useEffect(() => {


        if (
            selectedRegion !== "ALL"
        ) {

            flyToRegion(
                selectedRegion
            );

        }


    }, [
        selectedRegion,
        viewer,
    ]);








    useEffect(() => {


        if (!scene) {
            return;
        }



        const eventHandler =
            new ScreenSpaceEventHandler(
                scene.canvas
            );



        eventHandler.setInputAction(

            (movement: {
                position: Cartesian2;
            }) => {


                const picked =
                    scene.pick(
                        movement.position
                    );



                if (
                    typeof picked?.id === "string" &&
                    picked.id.startsWith(
                        "orbit-region-"
                    )
                ) {


                    const value =
                        picked.id.replace(
                            "orbit-region-",
                            ""
                        ) as OrbitRegion;



                    flyToRegion(
                        value
                    );



                    onSelectRegion(
                        value
                    );

                }


            },

            ScreenSpaceEventType.LEFT_CLICK

        );



        handler.current =
            eventHandler;



        return () => {

            eventHandler.destroy();

            handler.current =
                null;

        };


    }, [
        scene,
        viewer,
        onSelectRegion,
    ]);









    return (

        <>

            {
                regions.map(
                    region => {


                        const selected =
                            selectedRegion === region.name;



                        const radius =
                            6378137 +
                            (
                                region.altitudeKm *
                                VISUAL_ALTITUDE_SCALE *
                                1000
                            );



                        return (

                            <Entity

                                key={
                                    region.name
                                }


                                id={
                                    `orbit-region-${region.name}`
                                }


                                position={
                                    Cartesian3.ZERO
                                }


                            >


                                <EllipsoidGraphics


                                    radii={
                                        new Cartesian3(
                                            radius,
                                            radius,
                                            radius
                                        )
                                    }


                                    material={

                                        Color
                                            .fromCssColorString(
                                                region.color
                                            )
                                            .withAlpha(

                                                selected
                                                    ? 0.22
                                                    : 0.04

                                            )

                                    }



                                    outline={true}



                                    outlineColor={

                                        Color
                                            .fromCssColorString(
                                                region.color
                                            )
                                            .withAlpha(

                                                selected
                                                    ? 1.0
                                                    : 0.35

                                            )

                                    }



                                />


                            </Entity>

                        );


                    }
                )
            }


        </>

    );

}