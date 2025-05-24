export class KeyboardInputManager {
    #command = { x: 0, y: 0 };

    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.#command.y = -1;
                    break;
                case 'ArrowDown':
                    this.#command.y = 1;
                    break;
                case 'ArrowLeft':
                    this.#command.x = -1;
                    break;
                case 'ArrowRight':
                    this.#command.x = 1;
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    this.#command.y = 0;
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.#command.x = 0;
                    break;
            }
        });
    }

    getCommand() {
        // Normalize keyboard input to ensure consistent speed in all directions
        const length = Math.sqrt(this.#command.x * this.#command.x + this.#command.y * this.#command.y);
        if (length > 0) {
            return {
                x: this.#command.x / length,
                y: this.#command.y / length
            };
        }
        return { x: 0, y: 0 };
    }

    reset() {
        this.#command = { x: 0, y: 0 };
    }
} 