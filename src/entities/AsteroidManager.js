import * as THREE from 'three';
import { Asteroid } from './Asteroid.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class AsteroidManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.asteroids = [];
        this.spawnTimer = 0;
        this.lastSpawnCount = 0;  // Track how many asteroids were spawned in the last update
        this.initializePool();
    }

    initializePool() {
        // Create all asteroids initially behind the player
        for (let i = 0; i < GAME_CONFIG.asteroids.pool.totalCount; i++) {
            const size = Math.random() * 
                (GAME_CONFIG.asteroids.size.max - GAME_CONFIG.asteroids.size.min) + 
                GAME_CONFIG.asteroids.size.min;
            
            const position = new THREE.Vector3(0, 0, GAME_CONFIG.asteroids.pool.initialSpawnDistance); // Behind player
            
            const asteroid = new Asteroid(this.scene, position, size);
            this.asteroids.push(asteroid);
        }
    }

    getRandomPositionInSphere() {
        const playerPos = this.player.mesh.position;
        const center = new THREE.Vector3(
            playerPos.x,
            playerPos.y,
            playerPos.z + GAME_CONFIG.asteroids.spawnSphere.distance
        );

        // Generate random point in sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = GAME_CONFIG.asteroids.spawnSphere.radius * Math.cbrt(Math.random());

        return new THREE.Vector3(
            center.x + r * Math.sin(phi) * Math.cos(theta),
            center.y + r * Math.sin(phi) * Math.sin(theta),
            center.z + r * Math.cos(phi)
        );
    }

    isValidPosition(position, size) {
        // Check distance to other asteroids
        for (const asteroid of this.asteroids) {
            const distance = position.distanceTo(asteroid.getPosition());
            if (distance < (size + asteroid.getRadius() + GAME_CONFIG.asteroids.spawnSphere.minAsteroidDistance)) {
                return false;
            }
        }
        return true;
    }

    spawnFromPool() {
        // Find asteroids that are behind the player
        const availableAsteroids = this.asteroids.filter(asteroid => 
            asteroid.getPosition().z < this.player.mesh.position.z - GAME_CONFIG.asteroids.despawnDistance
        );

        if (availableAsteroids.length > 0) {
            // Get a random asteroid from the available ones
            const asteroid = availableAsteroids[Math.floor(Math.random() * availableAsteroids.length)];
            
            // Try to find a valid position in the spawn sphere
            let newPosition;
            let attempts = 0;
            const maxAttempts = 10;

            do {
                newPosition = this.getRandomPositionInSphere();
                attempts++;
            } while (GAME_CONFIG.asteroids.spawnSphere.checkOverlap && 
                    !this.isValidPosition(newPosition, asteroid.getRadius()) && 
                    attempts < maxAttempts);

            // If we're not checking overlap or we found a valid position
            if (!GAME_CONFIG.asteroids.spawnSphere.checkOverlap || attempts < maxAttempts) {
                asteroid.mesh.position.copy(newPosition);
                return true;  // Successfully spawned
            }
        }
        return false;  // Failed to spawn
    }

    update(deltaTime) {
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Calculate how many asteroids to spawn based on time and rate
        const asteroidsToSpawn = Math.floor(this.spawnTimer * GAME_CONFIG.asteroids.pool.spawnRate);
        
        // Spawn asteroids and reset timer
        this.lastSpawnCount = 0;  // Reset spawn count
        if (asteroidsToSpawn > 0) {
            for (let i = 0; i < asteroidsToSpawn; i++) {
                if (this.spawnFromPool()) {
                    this.lastSpawnCount++;
                }
            }
            this.spawnTimer = 0;
        }
        
        // Update all asteroids
        for (const asteroid of this.asteroids) {
            const asteroidPos = asteroid.getPosition();
            
            // Move asteroid towards player along Z axis only
            asteroidPos.z -= GAME_CONFIG.gameSpeed;
            
            asteroid.update();
        }
    }

    // Debug getters
    getDebugInfo() {
        return {
            spawnTimer: this.spawnTimer,
            lastSpawnCount: this.lastSpawnCount,
            spawnRate: GAME_CONFIG.asteroids.pool.spawnRate,
            availableAsteroids: this.asteroids.filter(asteroid => 
                asteroid.getPosition().z < this.player.mesh.position.z - GAME_CONFIG.asteroids.despawnDistance
            ).length,
            totalAsteroids: this.asteroids.length
        };
    }

    checkCollisions(player) {
        /*const playerPos = player.mesh.position;
        const playerRadius = GAME_CONFIG.player.collisionRadius;
        
        for (const asteroid of this.asteroids) {
            const asteroidPos = asteroid.getPosition();
            const distance = playerPos.distanceTo(asteroidPos);
            
            if (distance < (playerRadius + asteroid.getRadius())) {
                return true;
            }
        }*/
        return false;
    }
} 