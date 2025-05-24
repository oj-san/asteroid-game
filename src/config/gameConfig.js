export const GAME_CONFIG = {
    fog: {
        color: 0x000000,  // Black fog
        density: 0.0017    // Base density
    },
    gameSpeed: 550,  // Global game speed that affects asteroid movement
    player: {
        movementSensitivity: 100,
        collisionRadius: 2  // Approximate player collision radius
    },
    camera: {
        followDistance: 30,    // Distance behind player
        heightOffset: 10,      // Height above player
        lookAheadDistance: 50, // How far ahead the camera looks
        smoothFactor: 0.9995        // How smoothly the camera follows
    },
    asteroids: {
        pool: {
            totalCount: 200,  // Total number of asteroids in the pool
            spawnRate: 180,   // Asteroids to spawn per second
            initialSpawnDistance: -500 // Initial spawn position behind player
        },
        spawnSphere: {
            radius: 500,
            distance: 1300,
            minAsteroidDistance: 20,
            checkOverlap: false  // Whether to check for overlapping asteroids during spawn
        },
        size: {
            min: 5,
            max: 50
        },
        rotation: {
            speed: 0.3
        },
        despawnDistance: 50,  // Distance behind player to despawn
        collisionCheck: true  // Whether to check for collisions with player
    },
    dustParticles: {
        count: 4000,    // Number of particles
        speedFactor: 2,  // Speed factor relative to game speed (0.9 = 90% of game speed)
    },
    // Spawn Manager Configuration
    spawnManager: {
        box: {
            width: 100,     // Width of spawn area (X axis)
            height: 100,    // Height of spawn area (Y axis)
            depth: 100,     // Depth of spawn area (Z axis)
            distance: 1000  // Distance from player (Z offset)
        },
        debug: {
            enabled: false,  // Whether to show debug visualization
            color: 0x00ff00, // Color of debug visualization
            opacity: 0.3    // Opacity of debug visualization
        }
    },
}; 