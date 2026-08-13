import { useMemo } from "react";

import { Entity } from "resium";

import { Color } from "cesium";

import type { SatellitePosition } from "../../api";

import { renderPosition } from "./rendering";

interface Props {
    position: SatellitePosition;
}

export default function SelectedSatellite({ position }: Props) {
    const cesiumPosition = useMemo(
        () =>
            renderPosition(
                position.longitude,
                position.latitude,
                position.altitude_km,
            ),

        [position.longitude, position.latitude, position.altitude_km],
    );

    const description = useMemo(
        () => `

NORAD: ${position.norad_id}

Latitude:
${position.latitude.toFixed(2)}

Longitude:
${position.longitude.toFixed(2)}

Altitude:
${position.altitude_km.toFixed(0)} km

Velocity:
${position.velocity_km_s.toFixed(2)} km/s

            `,

        [position],
    );

    return (
        <Entity
            position={cesiumPosition}

            point={{
                pixelSize: 18,

                color: Color.CYAN,

                outlineColor: Color.WHITE,

                outlineWidth: 3,
            }}

            description={description}
        />
    );
}
