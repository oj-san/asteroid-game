import { GAME_CONFIG } from '../config/gameConfig.js';

export class DifficultyManager {
    constructor() {
        // Initialize with base values from config
        this.baseGameSpeed = GAME_CONFIG.gameSpeed.initial;
        this.baseSpawnRate = GAME_CONFIG.spawnRate.initial;
        
        // Current values that will be modified by difficulty
        this.currentGameSpeed = this.baseGameSpeed;
        this.currentSpawnRate = this.baseSpawnRate;
        
        // Get acceleration factors from config
        this.gameSpeedAcceleration = GAME_CONFIG.gameSpeed.acceleration;
        this.spawnRateAcceleration = GAME_CONFIG.spawnRate.acceleration;
        
        // Calculate max values from config
        this.maxGameSpeed = GAME_CONFIG.gameSpeed.max;
        this.maxSpawnRate = GAME_CONFIG.spawnRate.max;
        
        // Time tracking for progression
        this.lastUpdate = 0;
    }

    update(gameTime) {
        const deltaTime = gameTime - this.lastUpdate;
        this.lastUpdate = gameTime;
        
        // Increase game speed using acceleration factor, but don't exceed max
        this.currentGameSpeed = Math.min(
            this.maxGameSpeed,
            this.currentGameSpeed + (this.gameSpeedAcceleration * deltaTime)
        );
        
        // Increase spawn rate using acceleration factor, but don't exceed max
        this.currentSpawnRate = Math.min(
            this.maxSpawnRate,
            this.currentSpawnRate + (this.spawnRateAcceleration * deltaTime)
        );
    }

    getCurrentGameSpeed() {
        return this.currentGameSpeed;
    }

    getCurrentSpawnRate() {
        return this.currentSpawnRate;
    }

    reset() {
        this.currentGameSpeed = this.baseGameSpeed;
        this.currentSpawnRate = this.baseSpawnRate;
        this.lastUpdate = 0;
    }
} 