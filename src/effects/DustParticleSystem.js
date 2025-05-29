import * as THREE from 'three';
import { GAME_CONFIG } from '../config/gameConfig.js';
import { SpawnManager } from '../utils/SpawnManager.js';

export class DustParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.particleCount = GAME_CONFIG.dustParticles.count || 1000;
        this.speedFactor = GAME_CONFIG.dustParticles.speedFactor || 1;
        this.spawnManager = SpawnManager.getInstance(scene);
        
        this.createParticles();
    }

    createParticles() {
        // Create particle geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        // Create particles behind the player
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Initialize all particles at origin but behind the player
            positions[i3] = 0;     // X
            positions[i3 + 1] = 0; // Y
            positions[i3 + 2] = -1000; // Z (behind player)

            // Set particle color (slightly transparent white)
            colors[i3] = 0.8;     // R
            colors[i3 + 1] = 0.8; // G
            colors[i3 + 2] = 0.8; // B
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create particle material
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        // Create particle system
        this.particleSystem = new THREE.Points(geometry, material);
        this.particleSystem.frustumCulled = false;  // Disable frustum culling
        this.scene.add(this.particleSystem);
    }

    update(playerPosition, deltaTime, currentGameSpeed) {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;

        // Calculate particle speed based on game speed and speed factor
        const particleSpeed = currentGameSpeed * this.speedFactor;

        // Calculate maximum particles to reset this frame based on game speed
        const maxParticlesToReset = Math.floor(currentGameSpeed * GAME_CONFIG.dustParticles.spawnRateFactor * deltaTime);
        let resetCount = 0;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Move particle towards player (Z-axis only)
            positions[i3 + 2] -= particleSpeed * deltaTime;

            // Check if particle has passed the player (Z-axis only)
            if (positions[i3 + 2] < playerPosition.z) {
                // Only reset particles up to the maximum rate
                if (resetCount < maxParticlesToReset) {
                    // Reset particle using spawn manager
                    const newPosition = this.spawnManager.getRandomPositionInBox();
                    positions[i3] = newPosition.x;
                    positions[i3 + 1] = newPosition.y;
                    positions[i3 + 2] = newPosition.z;
                    resetCount++;
                } else {
                    // If we've hit our spawn rate limit, move the particle far behind the player
                    positions[i3 + 2] = playerPosition.z - 1000;
                }
            }
        }

        // Update the geometry
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }

    remove() {
        this.scene.remove(this.particleSystem);
        this.particleSystem.geometry.dispose();
        this.particleSystem.material.dispose();
    }
} 