export class AccelerometerInputManager {
    #command = { x: 0, y: 0 };
    #isSupported = false;
    #isActive = false;

    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Check if device orientation is supported
        if (window.DeviceOrientationEvent) {
            this.#isSupported = true;
            
            // Request permission for iOS 13+ devices
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                document.addEventListener('click', () => {
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                this.#isActive = true;
                                window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
                            }
                        })
                        .catch(console.error);
                }, { once: true });
            } else {
                // For non-iOS devices, just add the listener
                this.#isActive = true;
                window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
            }
        }

        // Handle visibility change to pause/resume orientation events
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.#isActive = false;
            } else if (this.#isSupported) {
                this.#isActive = true;
            }
        });
    }

    handleOrientation(event) {
        if (!this.#isActive) return;

        // Get device orientation data
        // Beta is the front-to-back tilt in degrees (-180 to 180)
        // Gamma is the left-to-right tilt in degrees (-90 to 90)
        const beta = event.beta;  // Front/back tilt
        const gamma = event.gamma; // Left/right tilt

        // Convert tilt to command values
        // Limit the tilt range and normalize to -1 to 1
        this.#command.x = Math.max(-1, Math.min(1, gamma / 45)); // 45 degrees = max tilt
        this.#command.y = Math.max(-1, Math.min(1, beta / 45));  // 45 degrees = max tilt

        // No need to invert Y axis as beta angle already provides correct direction
        // Tilt forward (positive beta) = move up
        // Tilt backward (negative beta) = move down
    }

    getCommand() {
        if (!this.#isSupported || !this.#isActive) {
            return { x: 0, y: 0 };
        }

        return {
            x: this.#command.x,
            y: this.#command.y
        };
    }

    reset() {
        this.#command = { x: 0, y: 0 };
    }

    isSupported() {
        return this.#isSupported;
    }
} 