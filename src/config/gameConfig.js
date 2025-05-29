export const GAME_CONFIG = {
    fog: {
        color: 0x000000,  // Black fog
        density: 0.0015    // Base density = 0.0015 by default
    },
    gameSpeed: {
        initial: 100,  // Initial game speed
        max: 1500,      // Maximum game speed
        acceleration: 3  // Speed increase per second
    },
    spawnRate: {
        initial: 0,  // Initial spawn rate (asteroids per second)
        max: 600,      // Maximum spawn rate
        acceleration: 1  // Spawn rate increase per second
    },
    player: {
        movementSensitivity: 100,
        collisionRadius: 2  // Approximate player collision radius
    },
    camera: {
        followDistance: 30,    // Distance behind player
        heightOffset: 10,      // Height above player
        lookAheadDistance: 50, // How far ahead the camera looks
        smoothFactor: 0.9995,  // How smoothly the camera follows
        farClippingPlane: 2000 // Maximum render distance
    },
    asteroids: {
        pool: {
            totalCount: 700,  // Total number of asteroids in the pool
            initialSpawnDistance: -500 // Initial spawn position behind player
        },
        size: {
            min: 5,
            max: 50
        },
        rotation: {
            speed: 0.3
        },
        despawnDistance: 50,  // Distance behind player to despawn
        collisionCheck: true,  // Whether to check for collisions with player
        debug: {
            showCollisionSpheres: false,  // Whether to show collision spheres
            sphereColor: 0xff0000,        // Color of collision spheres (red)
            sphereOpacity: 0.3            // Opacity of collision spheres
        }
    },
    dustParticles: {
        count: 8000,    // Number of particles
        speedFactor: 1.2,  // Speed factor relative to game speed (0.9 = 90% of game speed)
        spawnRateFactor: 0.7  // Maximum particles to spawn per second as a factor of game speed
    },
    // Spawn Manager Configuration
    spawnManager: {
        box: {
            width: 1000,     // Width of spawn area (X axis)
            height: 1000,    // Height of spawn area (Y axis)
            depth: 500,     // Depth of spawn area (Z axis)
            distance: 1300  // Distance from player (Z offset)
        },
        blindSpot: {
            radius: 40,      // Radius of the blind spot cylinder
            color: 0xff0000, // Color of blind spot visualization (red)
            opacity: 0.2     // Opacity of blind spot visualization
        },
        debug: {
            enabled: false,  // Whether to show debug visualization
            color: 0x00ff00, // Color of debug visualization
            opacity: 0.3    // Opacity of debug visualization
        }
    },
}; 