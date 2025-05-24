import { MouseInputManager } from './MouseInputManager.js';
import { TouchInputManager } from './TouchInputManager.js';
import { KeyboardInputManager } from './KeyboardInputManager.js';
import { AccelerometerInputManager } from './AccelerometerInputManager.js';

export class InputManager {
    constructor() {
        this.mouseInput = new MouseInputManager();
        this.touchInput = new TouchInputManager();
        this.keyboardInput = new KeyboardInputManager();
        this.accelerometerInput = new AccelerometerInputManager();
    }

    getCommand() {
        // Get commands from all input sources
        const mouseCommand = this.mouseInput.getCommand();
        const touchCommand = this.touchInput.getCommand();
        const keyboardCommand = this.keyboardInput.getCommand();
        const accelerometerCommand = this.accelerometerInput.getCommand();

        // Combine all commands
        const combinedCommand = {
            x: mouseCommand.x + touchCommand.x + keyboardCommand.x + accelerometerCommand.x,
            y: mouseCommand.y + touchCommand.y + keyboardCommand.y + accelerometerCommand.y
        };

        // Calculate magnitude of combined command
        const magnitude = Math.sqrt(
            combinedCommand.x * combinedCommand.x + 
            combinedCommand.y * combinedCommand.y
        );

        // Normalize if magnitude exceeds 1
        if (magnitude > 1) {
            combinedCommand.x /= magnitude;
            combinedCommand.y /= magnitude;
        }

        return combinedCommand;
    }

    reset() {
        this.mouseInput.reset();
        this.touchInput.reset();
        this.keyboardInput.reset();
        this.accelerometerInput.reset();
    }
} 