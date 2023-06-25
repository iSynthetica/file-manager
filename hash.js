import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { getCurrentDir, getAbsPath } from './currentPosition.js';

export class Hash {
    constructor() {}

    // hash zsh_history
    // hash Sites
    // hash .zprofile
    async hash([path_string]) {
        let abs_path = getAbsPath(path_string);
        let pathStat = await fs.promises.stat(abs_path);

        if (pathStat.isDirectory()) {
            throw new Error(`EISDIR: illegal operation on a directory, read`);
        }
        const readStream = fs.createReadStream(abs_path);
        let fileContent = '';

        for await (const chunk of readStream) {
            fileContent += chunk.toString();
        }
        const hash = crypto.createHash('sha256').update(fileContent);
        console.log(hash.digest('hex'));
    }
}
