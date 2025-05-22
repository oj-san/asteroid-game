import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.movementSensitivity = GAME_CONFIG.player.movementSensitivity;
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

    update(inputManager) {
        // Get mouse movement
        const movement = inputManager.getMovement();
        
        // Apply mouse movement to player position
        // Invert X movement because moving mouse right should move player right
        this.mesh.position.x -= movement.x * this.movementSensitivity;
        this.mesh.position.y -= movement.y * this.movementSensitivity;
        
        // Reset movement after applying it
        inputManager.resetMovement();
    }

    getPosition() {
        return this.mesh.position;
    }
} 