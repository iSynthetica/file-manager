// npm run start -- --username=your_username
import process from 'process';
import { App } from './app.js';
import { validateArgs, getUsername } from './helpers.js';

const app = new App(getUsername());

process.stdin.on('data', async data => {
    let message = data.toString().trim();
    if (message === '.exit') process.exit(1);

    try {
        await app.run(validateArgs(message));
    } catch (error) {
        process.stdout.write(`${error.message}\n`);
        process.stdout.write(`\x1b[31mInvalid input\x1b[0m\n\n`);
    }

    app.currentDirMessage();
});

process.on('SIGINT', () => {
    process.exit(1);
});

process.on('exit', () => {
    app.goodByeMessage();
});

app.welcomMessage();
