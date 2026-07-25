import {
    Cartesian3,
    Color,
    Material,
    PolylineCollection,
} from "cesium";

import { useCesium } from "resium";
import { useEffect } from "react";

interface Props {
    noradId: number;
}

export default function SelectedOrbitPrediction({
    noradId,
}: Props) {

    const { scene } = useCesium();

    useEffect(() => {

        if (!scene) return;

        const collection = new PolylineCollection();

        scene.primitives.add(collection);

        const positions: Cartesian3[] = [];

        // Temporary orbit arc
        for (let i = 0; i < 120; i++) {

            const angle = (i / 119) * Math.PI * 1.5;

            positions.push(
                Cartesian3.fromDegrees(
                    angle * 30 - 180,
                    Math.sin(angle) * 40,
                    500000
                )
            );

        }

        collection.add({
            positions,
            width: 3,
            material: Material.fromType(
                Material.PolylineGlowType,
                {
                    glowPower: 0.2,
                    color: Color.CYAN,
                }
            ),
        });

        return () => {

            if (!collection.isDestroyed()) {
                scene.primitives.remove(collection);
            }

        };

    }, [scene, noradId]);

    return null;

}
