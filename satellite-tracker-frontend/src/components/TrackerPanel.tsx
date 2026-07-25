import type {
    Satellite,
    SatelliteGroups,
    SatellitePosition,
} from "../api";


interface Props {

    groups: SatelliteGroups;

    satellites: Satellite[];

    selectedGroup: string;
    onGroupChange: (
        group: string
    ) => void;

    selectedNorad: number;
    onSatelliteChange: (
        norad: number
    ) => void;

    position: SatellitePosition;

    onRefresh: () => void;
}


export default function TrackerPanel({
    groups,
    satellites,

    selectedGroup,
    onGroupChange,

    selectedNorad,
    onSatelliteChange,

    position,

    onRefresh,

}: Props) {


    const selectedSatellite =
        satellites.find(
            (satellite) =>
                satellite.norad_id === selectedNorad
        );


    return (

        <aside className="overlay">


            <select
                value={selectedGroup}
                onChange={(event) =>
                    onGroupChange(
                        event.target.value
                    )
                }
            >

                <option value="">
                    All Satellites
                </option>


                {Object.entries(groups)
                    .map(
                        ([group, count]) => (

                            <option
                                key={group}
                                value={group}
                            >
                                {group}
                                {" "}
                                ({count})
                            </option>

                        )
                    )}

            </select>


            <select
                value={selectedNorad}
                onChange={(event) =>
                    onSatelliteChange(
                        Number(
                            event.target.value
                        )
                    )
                }
            >

                {satellites.map(
                    (satellite) => (

                        <option
                            key={satellite.norad_id}
                            value={satellite.norad_id}
                        >
                            {satellite.name}
                        </option>

                    )
                )}

            </select>


            <div className="telemetry">

                <h2>
                    {selectedSatellite?.name}
                </h2>


                <div>
                    Group:
                    {" "}
                    {selectedSatellite?.group}
                </div>


                <div>
                    NORAD:
                    {" "}
                    {position.norad_id}
                </div>


                <div>
                    LAT:
                    {" "}
                    {position.latitude.toFixed(2)}°
                </div>


                <div>
                    LON:
                    {" "}
                    {position.longitude.toFixed(2)}°
                </div>


                <div>
                    ALT:
                    {" "}
                    {position.altitude_km.toFixed(0)}
                    {" "}
                    km
                </div>

            </div>


            <button
                onClick={onRefresh}
            >
                Refresh
            </button>


        </aside>
    );
}
