import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.movementSensitivity = GAME_CONFIG.player.movementSensitivity;
        this.mesh = null;  // Initialize mesh as null
        this.createMesh();
    }

    createMesh() {
        const loader = new GLTFLoader();
        loader.load(
            `${import.meta.env.BASE_URL}art/ship.glb`,
            (gltf) => {
                this.mesh = gltf.scene;
                this.scene.add(this.mesh);
            },
            undefined,
            (error) => {
                console.error('Error loading ship model:', error);
            }
        );
    }

    update(inputManager, deltaTime) {
        // Skip update if mesh hasn't loaded yet
        if (!this.mesh) return;

        // Get command vector from input manager
        const command = inputManager.getCommand();
        
        // Apply movement
        this.mesh.position.x -= command.x * this.movementSensitivity * deltaTime;
        this.mesh.position.y -= command.y * this.movementSensitivity * deltaTime;
    }

    getPosition() {
        if (!this.mesh) {
            // Return a default position at origin if mesh isn't loaded yet
            return new THREE.Vector3(0, 0, 0);
        }
        return this.mesh.position;
    }
} 