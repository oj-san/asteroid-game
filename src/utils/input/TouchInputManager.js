export class TouchInputManager {
    #currentX = 0;
    #currentY = 0;

    constructor() {
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.isActive = false;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Touch events
        document.addEventListener('touchstart', (e) => {
            if (e.touches[0]) {
                this.#currentX = e.touches[0].clientX;
                this.#currentY = e.touches[0].clientY;
                this.isActive = true;
            }
        });
        document.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                this.#currentX = e.touches[0].clientX;
                this.#currentY = e.touches[0].clientY;
            }
        });
        document.addEventListener('touchend', () => {
            this.isActive = false;
        });
        document.addEventListener('touchcancel', () => {
            this.isActive = false;
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.centerX = window.innerWidth / 2;
            this.centerY = window.innerHeight / 2;
        });
    }

    getCommand() {
        if (!this.isActive) {
            return { x: 0, y: 0 };
        }

        const dx = this.#currentX - this.centerX;
        const dy = this.#currentY - this.centerY;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) {
            return { x: 0, y: 0 };
        }
        
        const maxDistance = Math.min(this.centerX, this.centerY);
        const normalizedLength = Math.min(length / maxDistance, 1);
        
        return {
            x: dx / length * normalizedLength,
            y: dy / length * normalizedLength
        };
    }

    reset() {
        this.#currentX = this.centerX;
        this.#currentY = this.centerY;
    }
} 