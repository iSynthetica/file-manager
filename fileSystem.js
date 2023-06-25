import fs from 'fs';
import path from 'path';
import { getCurrentDir, setCurrentDir, getAbsPath } from './currentPosition.js';

export class FileSystem {
    constructor() {}

    async up() {
        let currentPathArray = getCurrentDir().split(path.sep);

        if (currentPathArray.length > 1) {
            currentPathArray.pop();
            const currentPath = currentPathArray.length === 1 ? '/' : currentPathArray.join(path.sep);
            setCurrentDir(currentPath);
        }
    }

    async cd([path_string]) {
        let abs_path = getAbsPath(path_string);
        let pathStat = await fs.promises.stat(abs_path);

        if (!pathStat.isDirectory()) {
            throw new Error(`ENOENT: no such file or directory, stat '${abs_path}'`);
        }
        setCurrentDir(abs_path);
    }

    async ls() {
        let dirContent = await fs.promises.readdir(getCurrentDir(), { withFileTypes: true });

        let dirs = [];
        let files = [];

        if (dirContent && dirContent.length) {
            dirContent = dirContent.sort((b1, b2) => ('' + b1).localeCompare(b2));
            for (let item of dirContent) {
                if (item.isFile()) {
                    files.push({ Name: item.name, type: 'file' });
                } else {
                    dirs.push({ Name: item.name, type: 'directory' });
                }
            }
        }

        if (dirs.length || files.length) {
            console.table(dirs.concat(files));
        } else {
            console.log('Current directory is empty');
        }
    }

    async cat([path_to_file]) {
        const fullPath = getAbsPath(path_to_file);
        let content = await FileSystem.getFileContent(fullPath);

        console.log(content);
    }

    async add([new_file_name]) {
        const fullPath = getAbsPath(new_file_name);
        await fs.promises.writeFile(fullPath, '', { flag: 'ax+' });

        console.log(`File ${fullPath} created`);
    }

    async rm([path_to_file]) {
        const fullPath = getAbsPath(path_to_file);
        await fs.promises.rm(fullPath);

        console.log(`File ${fullPath} removed`);
    }

    static async getFileContent(path_to_file) {
        const readStream = fs.createReadStream(path_to_file);
        let fileContent = '';

        for await (const chunk of readStream) {
            fileContent += chunk.toString();
        }

        return fileContent;
    }
}
