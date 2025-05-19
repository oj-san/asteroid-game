import * as THREE from 'three';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class Asteroid {
    constructor(scene, position, size) {
        this.scene = scene;
        this.size = size;
        this.createMesh(position);
    }

    createMesh(position) {
        const geometry = new THREE.IcosahedronGeometry(
            this.size,
            GAME_CONFIG.asteroids.mesh.geometry.detail
        );
        const material = new THREE.MeshPhongMaterial({ 
            color: GAME_CONFIG.asteroids.mesh.color 
        });
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Set position
        this.mesh.position.copy(position);
        
        // Random rotation
        this.mesh.rotation.x = Math.random() * Math.PI;
        this.mesh.rotation.y = Math.random() * Math.PI;
        this.mesh.rotation.z = Math.random() * Math.PI;
        
        this.scene.add(this.mesh);
    }

    update() {
        // Rotate asteroid
        this.mesh.rotation.x += GAME_CONFIG.asteroids.rotation.speed;
        this.mesh.rotation.y += GAME_CONFIG.asteroids.rotation.speed;
    }

    getPosition() {
        return this.mesh.position;
    }

    getRadius() {
        return this.size;
    }

    remove() {
        this.scene.remove(this.mesh);
    }
} 