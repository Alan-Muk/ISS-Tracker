import { Entity, EllipsoidGraphics } from "resium";

import { Cartesian3, Color } from "cesium";

import { VISUAL_ALTITUDE_SCALE } from "./rendering";

import type { OrbitRegion } from "../../api";

export interface Region {
    name: OrbitRegion;

    altitudeKm: number;

    color: string;
}

export const regions: Region[] = [
    {
        name: "VLEO",
        altitudeKm: 150,
        color: "#00ffff",
    },

    {
        name: "LEO",
        altitudeKm: 800,
        color: "#00aaff",
    },

    {
        name: "MEO",
        altitudeKm: 10000,
        color: "#bb55ff",
    },

    {
        name: "GEO",
        altitudeKm: 35786,
        color: "#ffaa00",
    },

    {
        name: "HEO",
        altitudeKm: 20000,
        color: "#ff3366",
    },
];

interface Props {
    selectedRegion: OrbitRegion | "ALL";
}

export default function OrbitRegionRenderer({ selectedRegion }: Props) {
    return (
        <>
            {regions.map((region) => {
                const selected = selectedRegion === region.name;

                const radius =
                    6378137 + region.altitudeKm * VISUAL_ALTITUDE_SCALE * 1000;

                const color = Color.fromCssColorString(region.color);

                return (
                    <Entity
                        key={region.name}

                        id={`orbit-shell-${region.name}`}

                        position={Cartesian3.ZERO}
                    >
                        <EllipsoidGraphics
                            radii={
                                new Cartesian3(
                                    radius,

                                    radius,

                                    radius,
                                )
                            }

                            fill={false}

                            outline={true}

                            outlineColor={color.withAlpha(
                                selected ? 0.95 : 0.18,
                            )}

                            outlineWidth={selected ? 3 : 1}
                        />
                    </Entity>
                );
            })}
        </>
    );
}
