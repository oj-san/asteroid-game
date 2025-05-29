import * as THREE from 'three';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class DebugManager {
    constructor(scene) {
        this.scene = scene;
        this.debugElement = document.createElement('div');
        this.debugElement.style.position = 'fixed';
        this.debugElement.style.top = '10px';
        this.debugElement.style.right = '10px';
        this.debugElement.style.color = 'white';
        this.debugElement.style.fontFamily = 'monospace';
        this.debugElement.style.fontSize = '12px';
        this.debugElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.debugElement.style.padding = '10px';
        this.debugElement.style.borderRadius = '5px';
        this.debugElement.style.zIndex = '1000';
        document.body.appendChild(this.debugElement);

        // Create command vector line element
        this.commandVectorElement = document.createElement('div');
        this.commandVectorElement.style.position = 'fixed';
        this.commandVectorElement.style.left = '50%';
        this.commandVectorElement.style.top = '50%';
        this.commandVectorElement.style.width = '2px';
        this.commandVectorElement.style.height = '2px';
        this.commandVectorElement.style.backgroundColor = '#00ff00';
        this.commandVectorElement.style.transformOrigin = '0 0';
        this.commandVectorElement.style.pointerEvents = 'none';
        this.commandVectorElement.style.display = 'none';
        document.body.appendChild(this.commandVectorElement);

        this.lastFrameTime = performance.now();
        this.isDebugEnabled = false;  // Debug visualization starts disabled
        this.commandVectorLine = null;
        this.setupCommandVectorVisualization();
    }

    toggleDebug() {
        this.isDebugEnabled = !this.isDebugEnabled;
        this.commandVectorElement.style.display = this.isDebugEnabled ? 'block' : 'none';
        this.debugElement.style.display = this.isDebugEnabled ? 'block' : 'none';
    }

    setupCommandVectorVisualization() {
        // Create line for command vector
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00ff00,
            linewidth: 2
        });
        this.commandVectorLine = new THREE.Line(lineGeometry, lineMaterial);
        this.commandVectorLine.visible = this.isDebugEnabled;
        // Position the line in front of the camera
        this.commandVectorLine.position.z = -1;
        this.scene.add(this.commandVectorLine);
    }

    updateCommandVectorVisualization(command) {
        if (!this.isDebugEnabled) return;

        // Scale the command vector for better visibility
        const scale = 100; // Adjust this value to make the line longer/shorter
        const length = Math.sqrt(command.x * command.x + command.y * command.y) * scale;
        const angle = Math.atan2(command.y, command.x) * (180 / Math.PI);

        // Update the line element
        this.commandVectorElement.style.width = `${length}px`;
        this.commandVectorElement.style.transform = `rotate(${angle}deg)`;
    }

    update(player, asteroidManager, inputManager, difficultyManager) {
        if (!this.isDebugEnabled) return;

        const fps = Math.round(1000 / (performance.now() - this.lastFrameTime));
        const debugInfo = asteroidManager.getDebugInfo();
        const command = inputManager.getCommand();
        
        this.debugElement.innerHTML = `
            <div>FPS: ${fps}</div>
            <div>Asteroid Pool:</div>
            <div>  Total: ${debugInfo.totalAsteroids}/${GAME_CONFIG.asteroids.pool.totalCount}</div>
            <div>  Available: ${debugInfo.availableAsteroids}</div>
            <div>  Incoming: ${debugInfo.totalAsteroids - debugInfo.availableAsteroids}</div>
            <div>Spawn System:</div>
            <div>  Timer: ${debugInfo.spawnTimer.toFixed(2)}s</div>
            <div>  Rate: ${difficultyManager.getCurrentSpawnRate().toFixed(1)}/s</div>
            <div>  Last Spawn: ${debugInfo.lastSpawnCount}</div>
            <div>Game Speed: ${difficultyManager.getCurrentGameSpeed().toFixed(1)} km/s</div>
            <div>Position: (${player.mesh.position.x.toFixed(1)}, ${player.mesh.position.y.toFixed(1)}, ${player.mesh.position.z.toFixed(1)})</div>
            <div>Command: (${command.x.toFixed(3)}, ${command.y.toFixed(3)})</div>
            <div>Command Magnitude: ${Math.sqrt(command.x * command.x + command.y * command.y).toFixed(3)}</div>
        `;
        
        this.lastFrameTime = performance.now();

        // Update command vector visualization
        this.updateCommandVectorVisualization(command);
    }

    remove() {
        if (this.debugElement && this.debugElement.parentNode) {
            this.debugElement.parentNode.removeChild(this.debugElement);
        }
        if (this.commandVectorElement && this.commandVectorElement.parentNode) {
            this.commandVectorElement.parentNode.removeChild(this.commandVectorElement);
        }
        if (this.commandVectorLine) {
            this.scene.remove(this.commandVectorLine);
        }
    }
} 