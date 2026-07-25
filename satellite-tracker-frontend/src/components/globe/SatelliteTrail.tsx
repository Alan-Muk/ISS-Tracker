import {
    PolylineCollection,
    Color,
} from "cesium";

import { useCesium } from "resium";
import { useEffect } from "react";

import { trails } from "./satelliteTrails";

export default function SatelliteTrail() {

    const { scene } = useCesium();

    useEffect(() => {

        if (!scene) return;

        const lines = new PolylineCollection();

        scene.primitives.add(lines);

        const timer = setInterval(() => {

            if (lines.isDestroyed()) return;

            lines.removeAll();

            trails.forEach((points) => {

                if (points.length < 2) return;

                for (let i = 1; i < points.length; i++) {

                    lines.add({
                        positions: [
                            points[i - 1],
                            points[i],
                        ],
                        width: 2,
                        color: Color.CYAN.withAlpha(i / points.length),
                    });

                }

            });

        }, 100);

        return () => {

            clearInterval(timer);

            if (!lines.isDestroyed()) {
                scene.primitives.remove(lines);
            }

        };

    }, [scene]);

    return null;
}
