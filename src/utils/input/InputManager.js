import { MouseInputManager } from './MouseInputManager.js';
import { TouchInputManager } from './TouchInputManager.js';
import { KeyboardInputManager } from './KeyboardInputManager.js';

export class InputManager {
    constructor() {
        this.mouseInput = new MouseInputManager();
        this.touchInput = new TouchInputManager();
        this.keyboardInput = new KeyboardInputManager();
    }

    getCommand() {
        // Get commands from all input sources
        const mouseCommand = this.mouseInput.getCommand();
        const touchCommand = this.touchInput.getCommand();
        const keyboardCommand = this.keyboardInput.getCommand();

        // Combine commands
        const combinedCommand = {
            x: mouseCommand.x + touchCommand.x + keyboardCommand.x,
            y: mouseCommand.y + touchCommand.y + keyboardCommand.y
        };

        // Calculate the squared magnitude of the combined command
        const squaredMagnitude = 
            combinedCommand.x * combinedCommand.x + 
            combinedCommand.y * combinedCommand.y;

        // Only normalize if squared magnitude exceeds 1
        if (squaredMagnitude > 1) {
            const magnitude = Math.sqrt(squaredMagnitude);
            return {
                x: combinedCommand.x / magnitude,
                y: combinedCommand.y / magnitude
            };
        }

        // Return the combined command as is if squared magnitude is 1 or less
        return combinedCommand;
    }

    reset() {
        this.mouseInput.reset();
        this.touchInput.reset();
        this.keyboardInput.reset();
    }
} 