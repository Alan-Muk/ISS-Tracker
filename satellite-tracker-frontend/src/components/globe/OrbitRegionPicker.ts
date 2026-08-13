import { ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";

import type { Scene, Cartesian2 } from "cesium";

import type { OrbitRegion } from "../../api";

interface Props {
    scene: Scene;

    onSelect: (region: OrbitRegion) => void;
}

export function createOrbitRegionPicker({
    scene,

    onSelect,
}: Props) {
    const handler = new ScreenSpaceEventHandler(scene.canvas);

    handler.setInputAction(
        (movement: { position: Cartesian2 }) => {
            const picked = scene.pick(movement.position);

            const entity = picked?.id;

            if (
                entity &&
                typeof entity.id === "string" &&
                entity.id.startsWith("orbit-region-")
            ) {
                const region = entity.id.replace(
                    "orbit-region-",

                    "",
                ) as OrbitRegion;

                onSelect(region);
            }
        },

        ScreenSpaceEventType.LEFT_CLICK,
    );

    return handler;
}
