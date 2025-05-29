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

        // Initialize spawn box center position
        this.spawnBoxCenter = new THREE.Vector3(0, 0, this.spawnBox.distance);
        
        // Create debug visualization if enabled in config
        if (GAME_CONFIG.spawnManager.debug.enabled) {
            this.createDebugVisualization();
            this.createBlindSpotVisualization();
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
        this.debugBox.position.copy(this.spawnBoxCenter);
        this.scene.add(this.debugBox);
    }

    createBlindSpotVisualization() {
        // Create a cylinder geometry for the blind spot
        const geometry = new THREE.CylinderGeometry(
            GAME_CONFIG.spawnManager.blindSpot.radius,
            GAME_CONFIG.spawnManager.blindSpot.radius,
            this.spawnBox.depth,
            32
        );
        
        const material = new THREE.MeshBasicMaterial({
            color: GAME_CONFIG.spawnManager.blindSpot.color,
            transparent: true,
            opacity: GAME_CONFIG.spawnManager.blindSpot.opacity,
            wireframe: true
        });
        
        this.blindSpotCylinder = new THREE.Mesh(geometry, material);
        this.blindSpotCylinder.rotation.x = Math.PI / 2; // Rotate to align with Z axis
        this.scene.add(this.blindSpotCylinder);
    }

    getRandomPositionInBox() {
        // Generate random position within the box using current spawn box center
        let x, y, z;
        const minDistanceSquared = GAME_CONFIG.spawnManager.blindSpot.radius * 
                                 GAME_CONFIG.spawnManager.blindSpot.radius;

        do {
            x = this.spawnBoxCenter.x + (Math.random() - 0.5) * this.spawnBox.width;
            y = this.spawnBoxCenter.y + (Math.random() - 0.5) * this.spawnBox.height;
            z = this.spawnBoxCenter.z + (Math.random() - 0.5) * this.spawnBox.depth;
        } while (
            // Check if point is too close to center axis (x=player.x, y=player.y)
            (x - this.spawnBoxCenter.x) * (x - this.spawnBoxCenter.x) + 
            (y - this.spawnBoxCenter.y) * (y - this.spawnBoxCenter.y) < minDistanceSquared
        );

        return new THREE.Vector3(x, y, z);
    }

    getSpawnBoxCenter() {
        return this.spawnBoxCenter.clone();
    }

    update(playerPosition) {
        // Update spawn box center position based on player position
        this.spawnBoxCenter.set(
            playerPosition.x,
            playerPosition.y,
            playerPosition.z + this.spawnBox.distance
        );

        // Update debug visualization position if it exists
        if (this.debugBox) {
            this.debugBox.position.copy(this.spawnBoxCenter);
        }

        // Update blind spot visualization position if it exists
        if (this.blindSpotCylinder) {
            this.blindSpotCylinder.position.copy(this.spawnBoxCenter);
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
        if (this.blindSpotCylinder) {
            this.scene.remove(this.blindSpotCylinder);
            this.blindSpotCylinder.geometry.dispose();
            this.blindSpotCylinder.material.dispose();
        }
    }
} 