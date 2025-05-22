export const GAME_CONFIG = {
    fog: {
        color: 0x000000,  // Black fog
        density: 0.002    // Base density
    },
    gameSpeed: 5,  // Global game speed that affects asteroid movement
    player: {
        movementSensitivity: 0.1,
        collisionRadius: 2  // Approximate player collision radius
    },
    asteroids: {
        pool: {
            totalCount: 500,  // Total number of asteroids in the pool
            spawnRate: 30,   // Asteroids to spawn per second
            initialSpawnDistance: -100 // Initial spawn position behind player
        },
        spawnSphere: {
            radius: 500,
            distance: 1200,
            minAsteroidDistance: 20,
            checkOverlap: false  // Whether to check for overlapping asteroids during spawn
        },
        size: {
            min: 5,
            max: 50
        },
        rotation: {
            speed: 0.01
        },
        despawnDistance: 50  // Distance behind player to despawn
    }
}; 