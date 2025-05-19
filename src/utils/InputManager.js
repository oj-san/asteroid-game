export class InputManager {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.movementX = 0;
        this.movementY = 0;
        this.isPointerLocked = false;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Request pointer lock on click
        document.addEventListener('click', () => {
            if (!this.isPointerLocked) {
                document.body.requestPointerLock();
            }
        });

        // Handle pointer lock change
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
        });

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked) {
                this.movementX = e.movementX;
                this.movementY = e.movementY;
            }
        });
    }

    getMovement() {
        return {
            x: this.movementX,
            y: this.movementY
        };
    }

    resetMovement() {
        this.movementX = 0;
        this.movementY = 0;
    }
} 