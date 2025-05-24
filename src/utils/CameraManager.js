import * as THREE from 'three';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class CameraManager {
    constructor(camera) {
        this.camera = camera;
        this.targetPosition = new THREE.Vector3();
        this.currentPosition = new THREE.Vector3();
        this.lookAheadPosition = new THREE.Vector3();
        
        // Get camera configuration from game config
        this.followDistance = GAME_CONFIG.camera.followDistance;
        this.heightOffset = GAME_CONFIG.camera.heightOffset;
        this.lookAheadDistance = GAME_CONFIG.camera.lookAheadDistance;
        this.smoothFactor = GAME_CONFIG.camera.smoothFactor;
    }

    update(player, deltaTime) {
        // Calculate target position behind the player
        this.targetPosition.copy(player.getPosition());
        this.targetPosition.z -= this.followDistance;
        this.targetPosition.y += this.heightOffset;

        // Smoothly interpolate current position to target position
        // Use exponential smoothing that's independent of frame rate
        const smoothingFactor = 1 - Math.pow(1 - this.smoothFactor, deltaTime);
        this.currentPosition.lerp(this.targetPosition, smoothingFactor);

        // Update camera position
        this.camera.position.copy(this.currentPosition);

        // Calculate look-ahead position based on camera's current position
        this.lookAheadPosition.copy(this.currentPosition);
        this.lookAheadPosition.z += this.lookAheadDistance;

        // Make camera look ahead
        this.camera.lookAt(this.lookAheadPosition);
    }
} 