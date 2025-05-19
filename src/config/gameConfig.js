export const GAME_CONFIG = {
    fog: {
        color: 0x000000,  // Black fog
        density: 0.002    // Base density
    },
    player: {
        baseSpeed: 0.1,
        maxSpeed: 12.0,
        acceleration: 0.02,
        movementSensitivity: 0.1,
        collisionRadius: 2  // Approximate player collision radius
    },
    asteroids: {
        spawnSphere: {
            radius: 500,
            distance: 1200,
            minAsteroidDistance: 20,
            maxCount: 1000  // Maximum number of asteroids in the scene
        },
        size: {
            min: 5,
            max: 20
        },
        mesh: {
            color: 0x808080,  // Gray color
            geometry: {
                detail: 0  // Icosahedron detail level
            }
        },
        rotation: {
            speed: 0.01
        },
        despawnDistance: 50  // Distance behind player to despawn
    }
}; 