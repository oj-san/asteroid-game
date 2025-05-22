import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class Asteroid {
    constructor(scene, position, size) {
        this.scene = scene;
        this.size = size;
        this.createMesh(position);
    }

    createMesh(position) {
        const loader = new GLTFLoader();
        loader.load(
            `${import.meta.env.BASE_URL}art/small_asteroid.glb`,
            (gltf) => {
                this.mesh = gltf.scene;
                
                // Scale the model based on the size parameter
                const scale = this.size; // Adjust this divisor based on the model's base size
                this.mesh.scale.set(scale, scale, scale);
                
                // Set position
                this.mesh.position.copy(position);
                
                // Random rotation
                this.mesh.rotation.x = Math.random() * Math.PI;
                this.mesh.rotation.y = Math.random() * Math.PI;
                this.mesh.rotation.z = Math.random() * Math.PI;
                
                this.scene.add(this.mesh);
            },
            undefined,
            (error) => {
                console.error('Error loading asteroid model:', error);
            }
        );
    }

    update() {
        if (this.mesh) {
            // Rotate asteroid
            this.mesh.rotation.x += GAME_CONFIG.asteroids.rotation.speed;
            this.mesh.rotation.y += GAME_CONFIG.asteroids.rotation.speed;
        }
    }

    getPosition() {
        return this.mesh ? this.mesh.position : new THREE.Vector3();
    }

    getRadius() {
        return this.size;
    }

    remove() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }
    }
} 