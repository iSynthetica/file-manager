// npm run start -- --username=your_username
import process from 'node:process';
import { getCurrentDir, up } from './currentPosition.js';
import { App } from './app.js';

import { validateArgs } from './helpers.js';

const username = process.env.npm_config_username ? process.env.npm_config_username : 'Guest';
const app = new App(username);

process.stdin.on('data', async data => {
    let message = data.toString().trim();

    if (message === '.exit') process.exit(1);

    try {
        await app.run(validateArgs(message));
    } catch (error) {
        console.log(error.message);
        process.stdout.write(`Invalid input\n\n`);
    }
    
    app.currentDirMessage();
});

process.on('SIGINT', code => {
    process.exit(1);
});

process.on('exit', code => {
    process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`);
});

app.welcomMessage();
