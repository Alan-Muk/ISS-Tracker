import { memo } from "react";

import { Viewer } from "resium";

import GlobeScene from "./globe/GlobeScene";

import GlobeLayers from "./globe/GlobeLayers";

import Stars from "./globe/Stars";

import Earth from "./globe/Earth";

import type { Satellite, SatellitePosition, OrbitRegion } from "../api";

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

function CesiumGlobe({
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
        <Viewer
            animation={false}

            timeline={false}

            fullscreenButton={false}

            homeButton={false}

            sceneModePicker={false}

            baseLayerPicker={false}

            geocoder={false}

            navigationHelpButton={false}

            infoBox={false}

            selectionIndicator={false}

            terrainProvider={undefined}

            requestRenderMode={false}

            maximumRenderTimeChange={Infinity}

            style={{
                width: "100%",

                height: "100vh",
            }}
        >
            <GlobeScene />

            <Stars />

            <Earth />

            <GlobeLayers
                position={position}

                satellites={satellites}

                satelliteData={satelliteData}

                highlightedIds={highlightedIds}

                selectedNorad={selectedNorad}

                selectedRegion={selectedRegion}

                onSelect={onSelect}

                onRegionSelect={onRegionSelect}
            />
        </Viewer>
    );
}

export default memo(CesiumGlobe);
