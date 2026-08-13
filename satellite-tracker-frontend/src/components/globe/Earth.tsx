import { useEffect } from "react";

import { Globe, useCesium } from "resium";

import { Color } from "cesium";

export default function Earth() {
    const { scene } = useCesium();

    useEffect(() => {
        if (!scene) {
            return;
        }

        const currentScene = scene;
        const globe = currentScene.globe;

        //
        // Dark grayscale Earth
        //
        globe.baseColor = Color.fromCssColorString("#303030");
        globe.atmosphereLightIntensity = 0.15;

        currentScene.backgroundColor = Color.fromCssColorString("#02040a");

        //
        // Slow Earth rotation
        //
        let lastTime = performance.now();

        const rotate = () => {
            const now = performance.now();
            const delta = (now - lastTime) / 1000;
            lastTime = now;

            currentScene.camera.rotateRight(delta * 0.002);
            currentScene.requestRender();
        };

        currentScene.postRender.addEventListener(rotate);

        return () => {
            currentScene.postRender.removeEventListener(rotate);
        };
    }, [scene]);

    return <Globe showGroundAtmosphere enableLighting />;
}
