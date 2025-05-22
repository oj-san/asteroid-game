export class ScoreManager {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.updateDisplay(0);
    }

    updateDisplay(gameTime) {
        // Convert game time to minutes and seconds
        const minutes = Math.floor(gameTime / 60);
        const seconds = Math.floor(gameTime % 60);
        
        this.scoreElement.innerHTML = `
            <div>Survival Time: ${minutes}:${seconds.toString().padStart(2, '0')}</div>
        `;
    }

    reset() {
        this.updateDisplay(0);
    }
} 