import { useEffect } from "react";

import { useCesium } from "resium";

import { Color, PolylineCollection } from "cesium";

import { getPrediction } from "./predictionStore";

import { orbitPointsToCartesian } from "./orbitRendering";

interface Props {
    noradId: number;
}

export default function SelectedOrbitPrediction({ noradId }: Props) {
    const { scene } = useCesium();

    useEffect(() => {
        if (!scene) {
            return;
        }

        const prediction = getPrediction(noradId);

        if (!prediction || prediction.points.length < 2) {
            return;
        }

        const collection = new PolylineCollection();

        scene.primitives.add(collection);

        const positions = orbitPointsToCartesian(prediction.points);

        collection.add({
            positions,

            width: 3,

            material: Color.CYAN.withAlpha(0.8),
        });

        scene.requestRender();

        return () => {
            if (!collection.isDestroyed()) {
                scene.primitives.remove(collection);

                collection.destroy();
            }
        };
    }, [scene, noradId]);

    return null;
}
