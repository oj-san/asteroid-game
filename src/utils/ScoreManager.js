export class ScoreManager {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.updateDisplay(0, 0);
    }

    updateDisplay(distance, speed) {
        // Convert distance to kilometers and round to 2 decimal places
        const distanceInKm = (distance / 1000).toFixed(2);
        // Convert speed to a more readable format (km/h)
        const speedInKmh = (speed * 3600).toFixed(1);
        this.scoreElement.innerHTML = `
            <div>Distance: ${distanceInKm} km</div>
            <div>Speed: ${speedInKmh} km/h</div>
        `;
    }

    reset() {
        this.updateDisplay(0, 0);
    }
} 