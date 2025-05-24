export class MouseInputManager {
    #currentX = 0;
    #currentY = 0;

    constructor() {
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.isActive = false;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Always track mouse position
        document.addEventListener('mousemove', (e) => {
            this.#currentX = e.clientX;
            this.#currentY = e.clientY;
        });

        // Mouse down/up events
        document.addEventListener('mousedown', (e) => {
            this.#currentX = e.clientX;
            this.#currentY = e.clientY;
            this.isActive = true;
        });
        document.addEventListener('mouseup', () => {
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