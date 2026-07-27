import {
    Color,
} from "cesium";


import type {
    Satellite,
} from "../../api";





//
// Constellation colours
//

const groupColors: Record<string, Color> = {


    ISS:
        Color.WHITE,


    STARLINK:
        Color.CYAN,


    GPS:
        Color.ORANGE,


    ONEWEB:
        Color.MAGENTA,


    IRIDIUM:
        Color.LIME,


    NOAA:
        Color.AQUA,


    GALILEO:
        Color.BLUE,


    LANDSAT:
        Color.GREEN,


};






//
// Orbit colours
//

const orbitColors: Record<string, Color> = {


    VLEO:
        Color.CYAN,


    LEO:
        Color.LIME,


    MEO:
        Color.PURPLE,


    GEO:
        Color.YELLOW,


    HEO:
        Color.RED,


    UNKNOWN:
        Color.GRAY,


};








function normalize(

    value?: string,

) {


    return (

        value

            ?.toUpperCase()

            .replace(
                /[^A-Z0-9]/g,
                ""
            )

        ??

        ""

    );

}








function findGroupColor(

    group?: string,

) {


    const normalized =
        normalize(group);



    for (

        const key of Object.keys(groupColors)

    ) {


        if (

            normalized.includes(
                key
            )

        ) {

            return groupColors[key];

        }


    }


    return undefined;

}









export function getSatelliteColor(

    satellite: Satellite,

): Color {



    const constellationColor =

        findGroupColor(

            satellite.group

        );





    if (

        constellationColor

    ) {


        return constellationColor.clone();


    }






    const region =

        satellite.orbit?.region

        ??

        "UNKNOWN";





    return (

        orbitColors[region]

        ??

        orbitColors.UNKNOWN

    ).clone();


}









export function getTrailColor(

    satellite: Satellite,

): Color {


    return getSatelliteColor(

        satellite

    ).withAlpha(

        0.18

    );

}









export function getSelectedColor(

    satellite: Satellite,

): Color {


    return getSatelliteColor(

        satellite

    ).brighten(

        0.8,

        new Color()

    );


}