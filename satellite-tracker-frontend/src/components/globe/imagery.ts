import {
    OpenStreetMapImageryProvider,
} from "cesium";



export function createImageryProvider() {


    return new OpenStreetMapImageryProvider({

        url:
            "https://tile.openstreetmap.org/",

    });


}