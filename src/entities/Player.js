import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.baseSpeed = GAME_CONFIG.player.baseSpeed;
        this.currentSpeed = this.baseSpeed;
        this.maxSpeed = GAME_CONFIG.player.maxSpeed;
        this.acceleration = GAME_CONFIG.player.acceleration;
        this.movementSensitivity = GAME_CONFIG.player.movementSensitivity;
        this.createMesh();
    }

    createMesh() {
        // Load the ship model
        const loader = new GLTFLoader();
        loader.load(
            './art/ship.glb',
            (gltf) => {
                // Set up the ship model
                this.mesh = gltf.scene;
                this.scene.add(this.mesh);
            },
            undefined,
            (error) => {
                console.error('Error loading ship model:', error);
            }
        );
    }

    update(inputManager) {
        // Always move forward (towards positive Z)
        this.mesh.position.z += this.currentSpeed;
        
        // Get mouse movement
        const movement = inputManager.getMovement();
        
        // Apply mouse movement to player position
        // Invert X movement because moving mouse right should move player right
        this.mesh.position.x -= movement.x * this.movementSensitivity;
        this.mesh.position.y -= movement.y * this.movementSensitivity;
        
        // Reset movement after applying it
        inputManager.resetMovement();

        // Accelerate over time with a more gradual curve
        if (this.currentSpeed < this.maxSpeed) {
            // Slower acceleration as we approach max speed
            const accelerationFactor = 1 - (this.currentSpeed / this.maxSpeed);
            this.currentSpeed += this.acceleration * accelerationFactor;
        }
    }

    getDistanceTraveled() {
        return this.mesh.position.z;
    }

    getCurrentSpeed() {
        return this.currentSpeed;
    }
} 