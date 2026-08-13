import Earth from "./Earth";
import OrbitRegions from "./OrbitRegions";

import SatellitePoints from "./SatellitePoints";
import SatelliteTrail from "./SatelliteTrail";

import SelectedSatellite from "./SelectedSatellite";
import SelectedOrbitPrediction from "./SelectedOrbitPrediction";

import type { Satellite, SatellitePosition, OrbitRegion } from "../../api";

interface Props {
    position: SatellitePosition | null;

    satellites: SatellitePosition[];

    satelliteData: Satellite[];

    highlightedIds: number[];

    selectedNorad: number | null;

    selectedRegion: OrbitRegion | "ALL";

    onSelect: (noradId: number) => void;

    onRegionSelect: (region: OrbitRegion | "ALL") => void;
}

export default function GlobeLayers({
    position,

    satellites,

    satelliteData,

    highlightedIds,

    selectedNorad,

    selectedRegion,

    onSelect,

    onRegionSelect,
}: Props) {
    return (
        <>
            <Earth />

            <OrbitRegions
                selectedRegion={selectedRegion}

                onSelectRegion={onRegionSelect}
            />

            <SatelliteTrail satelliteData={satelliteData} />

            <SatellitePoints
                satellites={satellites}

                satelliteData={satelliteData}

                highlightedIds={highlightedIds}

                selectedNorad={selectedNorad}

                onSelect={onSelect}
            />

            {selectedNorad !== null && (
                <SelectedOrbitPrediction noradId={selectedNorad} />
            )}

            {selectedNorad !== null && position && (
                <SelectedSatellite position={position} />
            )}
        </>
    );
}
