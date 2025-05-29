import * as THREE from 'three';
import { Asteroid } from './Asteroid.js';
import { GAME_CONFIG } from '../config/gameConfig.js';
import { SpawnManager } from '../utils/SpawnManager.js';

export class AsteroidManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.asteroids = [];
        this.spawnTimer = 0;
        this.lastSpawnCount = 0;  // Track how many asteroids were spawned in the last update
        this.spawnManager = SpawnManager.getInstance(scene);
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
        // Skip spawning if player mesh hasn't loaded yet
        if (!this.player.mesh) return false;

        // Find asteroids that are behind the player and have loaded their mesh
        const availableAsteroids = this.asteroids.filter(asteroid => 
            asteroid.mesh && asteroid.getPosition().z < this.player.mesh.position.z - GAME_CONFIG.asteroids.despawnDistance
        );

        if (availableAsteroids.length > 0) {
            // Get a random asteroid from the available ones
            const asteroid = availableAsteroids[Math.floor(Math.random() * availableAsteroids.length)];
            
            // Get a random position from the spawn manager
            const newPosition = this.spawnManager.getRandomPositionInBox();
            asteroid.mesh.position.copy(newPosition);
            return true;  // Successfully spawned
        }
        return false;  // Failed to spawn
    }

    update(deltaTime, gameSpeed, spawnRate) {
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Calculate how many asteroids to spawn based on time and current spawn rate
        const asteroidsToSpawn = Math.floor(this.spawnTimer * spawnRate);
        
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
            
            // Move asteroid towards player along Z axis only, using deltaTime for frame-rate independent movement
            asteroidPos.z -= gameSpeed * deltaTime;
            
            asteroid.update(deltaTime);
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
        // Skip collision check if disabled in config or player mesh hasn't loaded yet
        if (!GAME_CONFIG.asteroids.collisionCheck || !player.mesh) return false;

        const playerPos = player.mesh.position;
        const playerRadius = GAME_CONFIG.player.collisionRadius;
        
        for (const asteroid of this.asteroids) {
            // Skip asteroids that haven't loaded yet
            if (!asteroid.mesh) continue;
            
            const asteroidPos = asteroid.getPosition();
            const distance = playerPos.distanceTo(asteroidPos);
            
            if (distance < (playerRadius + asteroid.getRadius())) {
                return true;
            }
        }
        return false;
    }
} 