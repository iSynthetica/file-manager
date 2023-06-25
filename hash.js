import fs from 'fs';
import crypto from 'crypto';
import { getAbsPath, validatePath } from './currentPosition.js';

export class Hash {
    constructor() {}

    // + hash book.txt
    // - hash zsh_history
    // - hash Sites
    async hash([path_to_file]) {
        let abs_path = await validatePath(getAbsPath(path_to_file), { exists: true, isFile: true });

        const readStream = fs.createReadStream(abs_path);
        let fileContent = '';

        for await (const chunk of readStream) {
            fileContent += chunk.toString();
        }
        const hash = crypto.createHash('sha256').update(fileContent);
        console.log(hash.digest('hex'));
    }
}
