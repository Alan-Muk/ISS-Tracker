import {
    memo,
} from "react";

import { Viewer } from "resium";

import GlobeScene from "./globe/GlobeScene";
import Earth from "./globe/Earth";

import SatellitePoints from "./globe/SatellitePoints";
import SatelliteTrail from "./globe/SatelliteTrail";
import SelectedOrbitPrediction from "./globe/SelectedOrbitPrediction";
import SelectedSatellite from "./globe/SelectedSatellite";
import OrbitRegions from "./globe/OrbitRegions";

import type {
    SatellitePosition,
    OrbitRegion,
} from "../api";


interface Props {

    position: SatellitePosition | null;

    satellites: SatellitePosition[];

    highlightedIds: number[];

    selectedNorad: number | null;

    selectedRegion: OrbitRegion | "ALL";

    onSelect: (
        noradId: number
    ) => void;

    onRegionSelect: (
        region: OrbitRegion | "ALL"
    ) => void;

}


function CesiumGlobe({

    position,
    satellites,
    highlightedIds,
    selectedNorad,
    selectedRegion,
    onSelect,
    onRegionSelect,

}: Props){


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


            requestRenderMode={true}

            maximumRenderTimeChange={Infinity}


            style={{

                width: "100%",

                height: "100vh",

            }}

        >


            <GlobeScene />


            <Earth />

        <OrbitRegions

            selectedRegion={
                selectedRegion
            }

            onSelectRegion={
                onRegionSelect
            }

        />


            {
                /*
                    Moving satellites leave
                    temporary trails
                */
            }

            <SatelliteTrail />


            <SatellitePoints

                satellites={
                    satellites
                }

                highlightedIds={
                    highlightedIds
                }

                selectedNorad={
                    selectedNorad ?? -1
                }

                onSelect={
                    onSelect
                }

            />



            {
                selectedNorad !== null &&

                <SelectedOrbitPrediction

                    noradId={
                        selectedNorad
                    }

                />

            }



            {
                selectedNorad !== null &&
                position &&

                <SelectedSatellite

                    position={
                        position
                    }

                />

            }


        </Viewer>

    );

}


export default memo(
    CesiumGlobe
);
