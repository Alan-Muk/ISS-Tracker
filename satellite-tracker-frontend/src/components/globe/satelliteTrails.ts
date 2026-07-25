import {
    Cartesian3
} from "cesium";


export const trails =
new Map<number, Cartesian3[]>();


export function pushTrail(
    norad:number,
    position:Cartesian3
){

    let trail =
        trails.get(norad);



    if(!trail){

        trail=[];

        trails.set(
            norad,
            trail
        );

    }



    trail.push(position);



    if(trail.length > 60){

        trail.shift();

    }


}
