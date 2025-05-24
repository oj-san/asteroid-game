import * as THREE from 'three';
import { Player } from '../entities/Player.js';
import { AsteroidManager } from '../entities/AsteroidManager.js';
import { InputManager } from '../utils/input/InputManager.js';
import { ScoreManager } from '../utils/ScoreManager.js';
import { DebugManager } from '../utils/DebugManager.js';
import { CameraManager } from '../utils/CameraManager.js';
import { DustParticleSystem } from '../effects/DustParticleSystem.js';
import { SpawnManager } from '../utils/SpawnManager.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Add fog to the scene using configuration
        this.scene.fog = new THREE.FogExp2(
            GAME_CONFIG.fog.color,
            GAME_CONFIG.fog.density
        );

        this.gameOverMessage = null;
        this.setupLighting();
        this.setupEventListeners();
        
        this.lastFrameTime = performance.now();
        this.initializeGame();
    }

    initializeGame() {
        // Clear existing game objects if any
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
        
        // Re-add lighting
        this.setupLighting();
        
        // Re-add fog
        this.scene.fog = new THREE.FogExp2(
            GAME_CONFIG.fog.color,
            GAME_CONFIG.fog.density
        );
        
        // Initialize game components
        this.inputManager = new InputManager();
        this.scoreManager = new ScoreManager();
        this.debugManager = new DebugManager(this.scene);
        this.player = new Player(this.scene);
        this.asteroidManager = new AsteroidManager(this.scene, this.player);
        this.cameraManager = new CameraManager(this.camera);
        this.dustParticleSystem = new DustParticleSystem(this.scene);
        this.spawnManager = SpawnManager.getInstance(this.scene);
        
        // Initialize debug visualization
        this.debugManager.createSpawnSphereVisualization(
            GAME_CONFIG.asteroids.spawnSphere.radius,
            GAME_CONFIG.asteroids.spawnSphere.distance
        );
        
        this.gameOver = false;
        this.gameTime = 0; // Track game time for scoring
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Add click/touch listener for restart
        window.addEventListener('mousedown', () => {
            if (this.gameOver) {
                this.restart();
            }
        });

        // Add touch listener for mobile devices
        window.addEventListener('touchstart', () => {
            if (this.gameOver) {
                this.restart();
            }
        });

        // Toggle debug visualization with F2 key
        window.addEventListener('keydown', (e) => {
            if (e.code === 'F2') {
                this.debugManager.toggleDebug();
            }
        });
    }

    restart() {
        // Remove game over message if it exists
        if (this.gameOverMessage) {
            document.body.removeChild(this.gameOverMessage);
            this.gameOverMessage = null;
        }
        
        // Remove debug display and particle system
        if (this.debugManager) {
            this.debugManager.remove();
        }
        if (this.dustParticleSystem) {
            this.dustParticleSystem.remove();
        }
        
        this.initializeGame();
        this.gameLoop();
    }

    update() {
        if (this.gameOver) return;

        // Calculate delta time
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;

        // Update game time
        this.gameTime += deltaTime;

        // Update player with deltaTime
        this.player.update(this.inputManager, deltaTime);

        // Update score display with game time
        this.scoreManager.updateDisplay(this.gameTime);

        // Update debug display
        this.debugManager.update(this.player, this.asteroidManager, this.inputManager);

        // Update camera using camera manager
        this.cameraManager.update(this.player, deltaTime);

        // Update asteroids with delta time
        this.asteroidManager.update(deltaTime);
        
        // Update dust particles
        this.dustParticleSystem.update(this.player.getPosition(), deltaTime);
        
        // Update spawn manager
        this.spawnManager.update(this.player.getPosition());
        
        // Check collisions
        if (this.asteroidManager.checkCollisions(this.player)) {
            this.handleGameOver();
        }
    }

    handleGameOver() {
        this.gameOver = true;
        const timeInMinutes = (this.gameTime / 60).toFixed(1);
        
        // Create game over message
        this.gameOverMessage = document.createElement('div');
        this.gameOverMessage.style.position = 'fixed';
        this.gameOverMessage.style.top = '50%';
        this.gameOverMessage.style.left = '50%';
        this.gameOverMessage.style.transform = 'translate(-50%, -50%)';
        this.gameOverMessage.style.color = 'white';
        this.gameOverMessage.style.fontFamily = 'Arial, sans-serif';
        this.gameOverMessage.style.fontSize = '24px';
        this.gameOverMessage.style.textAlign = 'center';
        this.gameOverMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.gameOverMessage.style.padding = '20px';
        this.gameOverMessage.style.borderRadius = '10px';
        this.gameOverMessage.style.zIndex = '1000';
        this.gameOverMessage.style.cursor = 'pointer'; // Add pointer cursor
        
        this.gameOverMessage.innerHTML = `
            <h2>Game Over!</h2>
            <p>Survival Time: ${timeInMinutes} minutes</p>
            <p>Click or tap anywhere to restart</p>
        `;
        
        document.body.appendChild(this.gameOverMessage);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    gameLoop() {
        if (this.gameOver) return;
        
        requestAnimationFrame(() => this.gameLoop());
        this.update();
        this.render();
    }

    start() {
        this.gameLoop();
    }
} 