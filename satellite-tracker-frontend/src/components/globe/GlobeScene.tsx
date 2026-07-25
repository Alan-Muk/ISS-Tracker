import { useEffect, useRef } from "react";
import { useCesium } from "resium";
import {
    Color,
    Cartesian3,
} from "cesium";

import "cesium/Build/Cesium/Widgets/widgets.css";


export default function GlobeScene() {

    const { viewer } = useCesium();

    const initialized =
        useRef(false);


    useEffect(() => {

        if (!viewer || initialized.current) {
            return;
        }


        initialized.current = true;


        const scene =
            viewer.scene;


        //
        // Rendering optimization
        //

        scene.requestRenderMode = true;

        scene.maximumRenderTimeChange =
            Infinity;


        //
        // Remove expensive/default UI assumptions
        //



        //
        // Space appearance
        //

        scene.backgroundColor =
            Color.fromCssColorString(
                "#0b1d38"
            );


        //
        // Earth appearance
        //

        const globe =
            scene.globe;


        globe.showGroundAtmosphere =
            true;


        globe.baseColor =
            Color.fromCssColorString(
                "#050505"
            );


        globe.enableLighting =
            false;


        //
        // Atmospheric effects
        //

        scene.fog.enabled =
            true;

        scene.fog.density =
            0.0002;


        //
        // Camera limits
        //

        const cameraController =
            scene.screenSpaceCameraController;


        cameraController.minimumZoomDistance =
            3000000;


        cameraController.maximumZoomDistance =
            20000000;


        //
        // Initial camera position
        //

        viewer.camera.setView({

            destination:
                Cartesian3.fromDegrees(
                    0,
                    20,
                    9000000
                ),

        });


        //
        // Force first render
        //

        scene.requestRender();


    }, [viewer]);


    return null;
}
