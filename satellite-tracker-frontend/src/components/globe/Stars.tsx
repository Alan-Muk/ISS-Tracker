import { useMemo } from "react";

import { Entity } from "resium";

import {
    Cartesian3,
    Color,
} from "cesium";


export default function Stars() {

    const stars =
        useMemo(() => {

            return Array.from(
                { length: 180 },
                () =>
                    Cartesian3.fromDegrees(
                        Math.random() * 360 - 180,
                        Math.random() * 180 - 90,
                        90_000_000,
                    )
            );

        }, []);


    return (
        <>
            {stars.map(
                (position, index) => (

                    <Entity
                        key={`star-${index}`}
                        position={position}

                        point={{
                            pixelSize:
                                1,

                            color:
                                Color.fromCssColorString(
                                    "#777777"
                                ),
                        }}
                    />

                )
            )}
        </>
    );
}
