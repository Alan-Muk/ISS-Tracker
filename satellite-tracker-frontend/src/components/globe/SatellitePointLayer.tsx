import { useEffect } from "react";

import { PointPrimitiveCollection, PointPrimitive, Color } from "cesium";

import { useCesium } from "resium";

import type { Satellite, SatellitePosition } from "../../api";

import { renderPosition } from "./rendering";

import {
    syncTrails,
    assignRandomOrbitTrails,
    pushTrail,
} from "./satelliteTrails";

import { getPrediction } from "./predictionStore";

import { createAnimatedSatellite } from "./SatelliteAnimator";

import type { AnimatedSatellite } from "./SatelliteAnimator";

import { getSatelliteColor } from "./satelliteColors";

interface Props {
    satellites: SatellitePosition[];

    satelliteData: Satellite[];

    highlightedIds: number[];

    selectedNorad: number | null;

    collection: React.MutableRefObject<PointPrimitiveCollection | null>;

    pointMap: React.MutableRefObject<Map<number, PointPrimitive>>;

    animatedSatellites: React.MutableRefObject<AnimatedSatellite[]>;
}

export default function SatellitePointLayer({
    satellites,

    satelliteData,

    highlightedIds,

    selectedNorad,

    collection,

    pointMap,

    animatedSatellites,
}: Props) {
    const { scene } = useCesium();

    useEffect(() => {
        const points = collection.current;

        if (!points || points.isDestroyed()) {
            return;
        }

        points.removeAll();

        pointMap.current.clear();

        const metadataMap = new Map(
            satelliteData.map((satellite) => [satellite.norad_id, satellite]),
        );

        animatedSatellites.current = satellites

            .map((satellite) => {
                const metadata = metadataMap.get(satellite.norad_id);

                const prediction = getPrediction(satellite.norad_id);

                const altitude =
                    metadata?.orbit?.altitude_km ?? satellite.altitude_km;

                if (prediction) {
                    return {
                        norad_id: satellite.norad_id,

                        prediction: prediction.points,

                        step_seconds: prediction.step_seconds,

                        elapsed_seconds: Math.random() * 500,
                    };
                }

                return createAnimatedSatellite(
                    satellite.norad_id,

                    altitude,

                    20,
                );
            })

            .filter(
                (satellite): satellite is AnimatedSatellite =>
                    satellite !== null,
            );

        syncTrails(satellites.map((satellite) => satellite.norad_id));

        //
        // Create some full orbital rings
        // atomic structure effect
        //

        assignRandomOrbitTrails(
            satellites.map((satellite) => satellite.norad_id),

            0.08,
        );

        satellites.forEach((satellite) => {
            const metadata = metadataMap.get(satellite.norad_id);

            const position = renderPosition(
                satellite.longitude,

                satellite.latitude,

                satellite.altitude_km,
            );

            const isHighlighted = highlightedIds.includes(satellite.norad_id);

            const isSelected = satellite.norad_id === selectedNorad;

            const fallbackSatellite = {
                ...satellite,

                name: "Unknown",

                group: "UNKNOWN",
            };

            const color = getSatelliteColor(metadata ?? fallbackSatellite);

            const point = points.add({
                position,

                pixelSize: isSelected ? 16 : isHighlighted ? 8 : 5,

                color: isSelected
                    ? color.brighten(
                          0.5,

                          new Color(),
                      )
                    : color,

                id: satellite,
            });

            pointMap.current.set(
                satellite.norad_id,

                point,
            );

            pushTrail(
                satellite.norad_id,

                position,
            );
        });

        scene?.requestRender();
    }, [
        satellites,

        satelliteData,

        highlightedIds,

        selectedNorad,

        collection,

        pointMap,

        animatedSatellites,

        scene,
    ]);

    return null;
}
