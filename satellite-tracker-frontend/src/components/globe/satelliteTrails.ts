import { Cartesian3 } from "cesium";

export const trails = new Map<number, Cartesian3[]>();

export const fullOrbitTrails = new Set<number>();

//
// Full orbit display
//

export function enableFullOrbitTrail(noradId: number) {
    fullOrbitTrails.add(noradId);
}

export function disableFullOrbitTrail(noradId: number) {
    fullOrbitTrails.delete(noradId);
}

//
// Add satellite movement point
//

export function pushTrail(
    norad: number,

    position: Cartesian3,
) {
    let trail = trails.get(norad);

    if (!trail) {
        trail = [];

        trails.set(
            norad,

            trail,
        );
    }

    trail.push(position);

    const limit = fullOrbitTrails.has(norad) ? 720 : 80;

    if (trail.length > limit) {
        trail.shift();
    }
}

//
// Randomly create the atomic orbit effect
//

export function assignRandomOrbitTrails(
    noradIds: number[],

    percentage = 0.05,
) {
    for (const id of noradIds) {
        if (Math.random() < percentage) {
            enableFullOrbitTrail(id);
        }
    }
}

//
// Remove stale satellites
//

export function syncTrails(activeNoradIds: number[]) {
    const active = new Set(activeNoradIds);

    for (const norad of trails.keys()) {
        if (!active.has(norad)) {
            trails.delete(norad);

            fullOrbitTrails.delete(norad);
        }
    }
}

//
// Clear everything
//

export function clearTrails() {
    trails.clear();

    fullOrbitTrails.clear();
}
