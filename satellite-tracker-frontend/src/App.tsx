import {
    useEffect,
    useState,
} from "react";

import CesiumGlobe from "./components/CesiumGlobe";

import {
    getPosition,
    getSatellites,
    getSatelliteGroups,

    type Satellite,
    type SatellitePosition,
    type OrbitRegion,
} from "./api";



function App() {


    const [
        satellites,
        setSatellites,
    ] = useState<Satellite[]>([]);



    const [
        visiblePositions,
        setVisiblePositions,
    ] = useState<SatellitePosition[]>([]);



    const [
        groups,
        setGroups,
    ] = useState<Record<string, number>>({});



    const [
        selectedGroup,
        setSelectedGroup,
    ] = useState("ALL");



    const [
        selectedRegion,
        setSelectedRegion,
    ] = useState<OrbitRegion | "ALL">(
        "ALL"
    );



    const [
        highlightedIds,
        setHighlightedIds,
    ] = useState<number[]>([]);



    const [
        selectedNorad,
        setSelectedNorad,
    ] = useState(25544);



    const [
        position,
        setPosition,
    ] = useState<SatellitePosition | null>(null);


    const selectorSatellites =
    [
        ...satellites
    ]
    .sort(
        (a, b) => {

            const aHighlighted =
                highlightedIds.includes(
                    a.norad_id
                );

            const bHighlighted =
                highlightedIds.includes(
                    b.norad_id
                );


            const aSelected =
                a.norad_id === selectedNorad;

            const bSelected =
                b.norad_id === selectedNorad;



            // Selected satellite always first
            if (aSelected && !bSelected) {
                return -1;
            }

            if (!aSelected && bSelected) {
                return 1;
            }



            // Highlighted satellites next
            if (
                aHighlighted &&
                !bHighlighted
            ) {
                return -1;
            }

            if (
                !aHighlighted &&
                bHighlighted
            ) {
                return 1;
            }



            return a.name.localeCompare(
                b.name
            );

        }
    );






    useEffect(() => {

        getSatellites()
            .then(setSatellites)
            .catch(console.error);

    }, []);






    useEffect(() => {

        getSatelliteGroups()
            .then(setGroups)
            .catch(console.error);

    }, []);







    //
    // Automatically select orbit from group
    //
    useEffect(() => {


        if (
            selectedGroup === "ALL"
        ) {

            setSelectedRegion(
                "ALL"
            );

            return;

        }



        const matching =
            satellites.filter(
                satellite =>
                    satellite.group === selectedGroup
            );



        const counts =
            matching.reduce(
                (
                    acc,
                    satellite
                ) => {


                    const region =
                        satellite.orbit?.region;



                    if (region) {

                        acc[region] =
                            (
                                acc[region] ?? 0
                            ) + 1;

                    }


                    return acc;


                },

                {} as Record<string, number>

            );



        const dominant =
            Object.entries(counts)
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b[1] - a[1]
                )[0];



        if (dominant) {

            setSelectedRegion(
                dominant[0] as OrbitRegion
            );

        }


    }, [
        selectedGroup,
        satellites,
    ]);







    //
    // Highlight matching satellites
    //
    useEffect(() => {


        const filtered =
            satellites.filter(
                satellite => {


                    const groupMatch =
                        selectedGroup === "ALL" ||
                        satellite.group === selectedGroup;



                    const orbitMatch =
                        selectedRegion === "ALL" ||
                        satellite.orbit?.region === selectedRegion;



                    return (
                        groupMatch &&
                        orbitMatch
                    );

                }
            );



        setHighlightedIds(
            filtered.map(
                satellite =>
                    satellite.norad_id
            )
        );



        if (
            filtered.length > 0 &&
            !filtered.some(
                satellite =>
                    satellite.norad_id === selectedNorad
            )
        ) {

            setSelectedNorad(
                filtered[0].norad_id
            );

        }


    }, [
        satellites,
        selectedGroup,
        selectedRegion,
    ]);







    //
    // Load positions
    //
    useEffect(() => {


        async function loadPositions() {


            const positions =
                await Promise.all(

                    satellites.map(
                        satellite =>
                            getPosition(
                                satellite.norad_id
                            )
                    )

                );


            setVisiblePositions(
                positions
            );

        }



        if (
            satellites.length > 0
        ) {

            loadPositions()
                .catch(console.error);

        }


    }, [
        satellites,
    ]);








    //
    // Selected telemetry
    //
    useEffect(() => {


        async function load() {


            const data =
                await getPosition(
                    selectedNorad
                );


            setPosition(
                data
            );


        }



        load()
            .catch(console.error);



        const timer =
            setInterval(
                () => {

                    load()
                        .catch(console.error);

                },

                5000
            );



        return () =>
            clearInterval(timer);


    }, [
        selectedNorad,
    ]);







    if (!position) {

        return (

            <div className="loading">

                Loading satellites...

            </div>

        );

    }







    return (

        <div className="app">


            <main className="map">


                <CesiumGlobe

                    position={position}

                    satellites={visiblePositions}

                    highlightedIds={highlightedIds}

                    selectedNorad={selectedNorad}

                    selectedRegion={selectedRegion}

                    onSelect={
                        setSelectedNorad
                    }

                    onRegionSelect={
                        setSelectedRegion
                    }

                />


            </main>





            <aside className="overlay">


                <select

                    value={selectedGroup}

                    onChange={
                        event =>
                            setSelectedGroup(
                                event.target.value
                            )
                    }

                >

                    <option value="ALL">
                        ALL SATELLITES
                    </option>


                    {
                        Object.entries(groups)
                            .map(
                                ([group,count]) => (

                                    <option
                                        key={group}
                                        value={group}
                                    >

                                        {group}
                                        {" "}
                                        ({count})

                                    </option>

                                )
                            )
                    }


                </select>





                <select

                    value={selectedRegion}

                    onChange={
                        event =>
                            setSelectedRegion(
                                event.target.value as OrbitRegion | "ALL"
                            )
                    }

                >

                    <option value="ALL">
                        ALL ORBITS
                    </option>

                    <option value="VLEO">
                        VLEO
                    </option>

                    <option value="LEO">
                        LEO
                    </option>

                    <option value="MEO">
                        MEO
                    </option>

                    <option value="GEO">
                        GEO
                    </option>

                    <option value="HEO">
                        HEO
                    </option>


                </select>





                <select

                    value={selectedNorad}

                    onChange={
                        event =>
                            setSelectedNorad(
                                Number(
                                    event.target.value
                                )
                            )
                    }

                >

                    {
                        selectorSatellites.map(
                            satellite => (

                                <option

                                    key={
                                        satellite.norad_id
                                    }

                                    value={
                                        satellite.norad_id
                                    }

                                >

                                    {
                                        highlightedIds.includes(
                                            satellite.norad_id
                                        )
                                            ? "★ "
                                            : ""
                                    }

                                    {satellite.name}

                                </option>

                            )
                        )
                    }

                </select>





                <div className="telemetry">

                    <h2>

                        {
                            satellites.find(
                                satellite =>
                                    satellite.norad_id === selectedNorad
                            )?.name
                        }

                    </h2>


                    <div>
                        Orbit:
                        {" "}
                        {selectedRegion}
                    </div>


                    <div>
                        Highlighted:
                        {" "}
                        {highlightedIds.length}
                    </div>


                    <div>
                        NORAD {position.norad_id}
                    </div>


                    <div>
                        ALT {position.altitude_km.toFixed(0)} km
                    </div>


                </div>


            </aside>


        </div>

    );

}


export default App;