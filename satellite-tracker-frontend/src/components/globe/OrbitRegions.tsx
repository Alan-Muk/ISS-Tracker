import {
    useEffect,
} from "react";


import {
    useCesium,
} from "resium";


import type {
    OrbitRegion,
} from "../../api";


import {
    useOrbitCamera,
} from "../../hooks/useOrbitCamera";


import OrbitRegionRenderer from "./OrbitRegionRenderer";


import {
    createOrbitRegionPicker,
} from "./OrbitRegionPicker";




interface Props {

    selectedRegion: OrbitRegion | "ALL";


    onSelectRegion: (

        region: OrbitRegion | "ALL"

    ) => void;

}






export default function OrbitRegions({

    selectedRegion,

    onSelectRegion,

}: Props) {



    const {
        scene,
    } = useCesium();





    const {
        flyToRegion,
    } = useOrbitCamera();








    //
    // Camera movement
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

        flyToRegion,

    ]);








    //
    // Region click selection
    //

    useEffect(() => {


        if (!scene) {

            return;

        }





        const handler =

            createOrbitRegionPicker({

                scene,


                onSelect:

                    region => {


                        onSelectRegion(

                            region

                        );



                        flyToRegion(

                            region

                        );


                    },

            });






        return () => {


            handler.destroy();


        };



    }, [

        scene,

        flyToRegion,

        onSelectRegion,

    ]);







    return (


        <OrbitRegionRenderer

            selectedRegion={

                selectedRegion

            }


        />


    );

}