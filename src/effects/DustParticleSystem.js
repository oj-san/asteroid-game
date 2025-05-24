import * as THREE from 'three';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class DustParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.particleCount = GAME_CONFIG.dustParticles.count || 1000;
        this.speedFactor = GAME_CONFIG.dustParticles.speedFactor || 1;
        this.spawnSphereRadius = GAME_CONFIG.asteroids.spawnSphere.radius;
        this.spawnSphereDistance = GAME_CONFIG.asteroids.spawnSphere.distance;
        
        this.createParticles();
    }

    createParticles() {
        // Create particle geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        // Create particles in a sphere around the spawn sphere
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Generate random position on spawn sphere surface
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = this.spawnSphereRadius + (Math.random() * 2 - 1) * 2; // Add some variation

            positions[i3] = (this.spawnSphereDistance + radius) * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = (this.spawnSphereDistance + radius) * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = (this.spawnSphereDistance + radius) * Math.cos(phi);

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
        this.scene.add(this.particleSystem);
    }

    update(playerPosition, deltaTime) {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;

        // Calculate particle speed based on game speed and speed factor
        const particleSpeed = GAME_CONFIG.gameSpeed * this.speedFactor;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Move particle towards player (Z-axis only)
            positions[i3 + 2] -= particleSpeed * deltaTime;

            // Check if particle has passed the player (Z-axis only)
            if (positions[i3 + 2] < playerPosition.z) {
                // Reset particle to spawn sphere
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const radius = this.spawnSphereRadius + (Math.random() * 2 - 1) * 2;

                positions[i3] = (this.spawnSphereDistance + radius) * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = (this.spawnSphereDistance + radius) * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = (this.spawnSphereDistance + radius) * Math.cos(phi);
            }

            // Update particle color based on Z distance to player
            /*const zDistance = Math.abs(positions[i3 + 2] - playerPosition.z);
            const alpha = Math.min(1, zDistance / 10);
            colors[i3] = 0.8 * alpha;     // R
            colors[i3 + 1] = 0.8 * alpha; // G
            colors[i3 + 2] = 0.8 * alpha; // B*/
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