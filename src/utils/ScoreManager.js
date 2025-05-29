export class ScoreManager {
    constructor() {
        // Remove any existing score element first
        const existingScore = document.querySelector('.game-score');
        if (existingScore) {
            existingScore.remove();
        }

        this.scoreElement = document.createElement('div');
        this.scoreElement.className = 'game-score'; // Add a class for easier identification
        this.scoreElement.style.position = 'fixed';
        this.scoreElement.style.top = '20px';
        this.scoreElement.style.left = '20px';
        this.scoreElement.style.color = 'white';
        this.scoreElement.style.fontFamily = 'Arial, sans-serif';
        this.scoreElement.style.fontSize = '24px';
        this.scoreElement.style.zIndex = '1000';
        this.scoreElement.style.whiteSpace = 'nowrap';
        this.scoreElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.scoreElement.style.padding = '5px 10px';
        this.scoreElement.style.borderRadius = '5px';
        document.body.appendChild(this.scoreElement);
        
        // Initialize with zero values
        this.updateDisplay(0, 0);
    }

    updateDisplay(gameTime, currentSpeed) {
        const minutes = Math.floor(gameTime / 60);
        const seconds = Math.floor(gameTime % 60);
        const speed = currentSpeed.toFixed(1);
        this.scoreElement.innerHTML = `Time: ${minutes}:${seconds.toString().padStart(2, '0')} | Speed: ${speed} km/s`;
    }

    reset() {
        // Reset to initial values
        this.updateDisplay(0, 0);
    }

    remove() {
        if (this.scoreElement && this.scoreElement.parentNode) {
            this.scoreElement.parentNode.removeChild(this.scoreElement);
        }
    }
} 