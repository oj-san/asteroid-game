import * as THREE from 'three';
import { Asteroid } from './Asteroid.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class AsteroidManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.asteroids = [];
    }

    createAsteroid() {
        const size = Math.random() * 
            (GAME_CONFIG.asteroids.size.max - GAME_CONFIG.asteroids.size.min) + 
            GAME_CONFIG.asteroids.size.min;
        const position = this.getRandomPositionInSphere();
        
        if (this.isValidPosition(position, size)) {
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

    update() {
        const playerPos = this.player.mesh.position;
        
        // Spawn new asteroids if below maximum count
        if (this.asteroids.length < GAME_CONFIG.asteroids.spawnSphere.maxCount) {
            this.createAsteroid();
        }
        
        // Update and check for despawning
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            const asteroidPos = asteroid.getPosition();
            
            // Despawn if too far behind
            if (asteroidPos.z < playerPos.z - GAME_CONFIG.asteroids.despawnDistance) {
                asteroid.remove();
                this.asteroids.splice(i, 1);
                continue;
            }
            
            asteroid.update();
        }
    }

    checkCollisions(player) {
        const playerPos = player.mesh.position;
        const playerRadius = GAME_CONFIG.player.collisionRadius;
        
        for (const asteroid of this.asteroids) {
            const asteroidPos = asteroid.getPosition();
            const distance = playerPos.distanceTo(asteroidPos);
            
            if (distance < (playerRadius + asteroid.getRadius())) {
                return true;
            }
        }
        return false;
    }
} 