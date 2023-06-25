import { FileSystem } from './fileSystem.js';
import { OperatingSystem } from './operatingSystem.js';
import { getCurrentDir } from './currentPosition.js';
import { Hash } from './hash.js';

export class App {
    constructor(username) {
        this.username = username;
        this.fs = new FileSystem();
        this.os = new OperatingSystem();
        this.hash = new Hash();
    }

    async run({ controller, command, args = [] }) {
        await this[controller][command](args);
    }

    welcomMessage() {
        process.stdout.write(`Welcome to the File Manager, ${this.username}!\n`);
        this.currentDirMessage();
    }

    goodByeMessage() {
        process.stdout.write(`\nThank you for using File Manager, ${this.username}, goodbye!\n`);
    }

    currentDirMessage() {
        process.stdout.write(`You are currently in \x1b[7m\x1b[1m ${getCurrentDir()} \x1b[0m \x1b[32m>>\x1b[0m `);
    }
}
