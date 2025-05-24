import * as THREE from 'three';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class SpawnManager {
    static instance = null;

    static getInstance(scene) {
        if (!SpawnManager.instance) {
            SpawnManager.instance = new SpawnManager(scene);
        }
        return SpawnManager.instance;
    }

    constructor(scene) {
        if (SpawnManager.instance) {
            return SpawnManager.instance;
        }
        
        this.scene = scene;
        this.spawnBox = {
            width: GAME_CONFIG.spawnManager.box.width,
            height: GAME_CONFIG.spawnManager.box.height,
            depth: GAME_CONFIG.spawnManager.box.depth,
            distance: GAME_CONFIG.spawnManager.box.distance
        };
        
        // Create debug visualization if enabled in config
        if (GAME_CONFIG.spawnManager.debug.enabled) {
            this.createDebugVisualization();
        }

        SpawnManager.instance = this;
    }

    createDebugVisualization() {
        // Create a wireframe box to visualize the spawn area
        const geometry = new THREE.BoxGeometry(
            this.spawnBox.width,
            this.spawnBox.height,
            this.spawnBox.depth
        );
        const material = new THREE.MeshBasicMaterial({
            color: GAME_CONFIG.spawnManager.debug.color,
            wireframe: true,
            transparent: true,
            opacity: GAME_CONFIG.spawnManager.debug.opacity
        });
        
        this.debugBox = new THREE.Mesh(geometry, material);
        this.scene.add(this.debugBox);
    }

    getRandomPositionInBox(playerPosition) {
        // Calculate the center of the spawn box based on player position
        const center = new THREE.Vector3(
            playerPosition.x,
            playerPosition.y,
            playerPosition.z + this.spawnBox.distance
        );

        // Generate random position within the box
        return new THREE.Vector3(
            center.x + (Math.random() - 0.5) * this.spawnBox.width,
            center.y + (Math.random() - 0.5) * this.spawnBox.height,
            center.z + (Math.random() - 0.5) * this.spawnBox.depth
        );
    }

    update(playerPosition) {
        // Update debug visualization position if it exists
        if (this.debugBox) {
            this.debugBox.position.set(
                playerPosition.x,
                playerPosition.y,
                playerPosition.z + this.spawnBox.distance
            );
        }
    }

    setSpawnBoxDimensions(width, height, depth, distance) {
        this.spawnBox.width = width;
        this.spawnBox.height = height;
        this.spawnBox.depth = depth;
        this.spawnBox.distance = distance;

        // Update debug visualization if it exists
        if (this.debugBox) {
            this.debugBox.geometry.dispose();
            this.debugBox.geometry = new THREE.BoxGeometry(width, height, depth);
        }
    }

    remove() {
        if (this.debugBox) {
            this.scene.remove(this.debugBox);
            this.debugBox.geometry.dispose();
            this.debugBox.material.dispose();
        }
    }
} 