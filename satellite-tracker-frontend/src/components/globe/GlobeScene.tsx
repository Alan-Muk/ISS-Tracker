import {
    useEffect,
    useRef,
} from "react";


import {
    useCesium,
} from "resium";


import {
    Cartesian3,
    Color,
} from "cesium";


import {
    createImageryProvider,
} from "./imagery";


import "cesium/Build/Cesium/Widgets/widgets.css";







export default function GlobeScene() {


    const {
        viewer,
    } = useCesium();




    const initialized =
        useRef(false);






    useEffect(() => {


        if (

            !viewer ||

            initialized.current

        ) {

            return;

        }




        initialized.current =
            true;





        const scene =
            viewer.scene;





        //
        // Imagery
        //

        viewer.imageryLayers.removeAll();


        viewer.imageryLayers.addImageryProvider(

            createImageryProvider()

        );






        //
        // Rendering
        //

        scene.requestRenderMode =
            true;


        scene.maximumRenderTimeChange =
            Infinity;







        //
        // Space background
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
        // Atmosphere
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
            3_000_000;



        cameraController.maximumZoomDistance =
            20_000_000;








        //
        // Initial camera
        //

        viewer.camera.setView({

            destination:

                Cartesian3.fromDegrees(

                    0,

                    20,

                    9_000_000

                ),

        });







        scene.requestRender();





    }, [

        viewer,

    ]);






    return null;

}