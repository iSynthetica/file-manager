import fs from 'fs';
import path from 'path';
import { getCurrentDir, setCurrentDir } from './currentPosition.js';

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
        let abs_path = FileSystem.getAbsPath(path_string);
        let pathStat = await fs.promises.stat(abs_path);

        if (!pathStat.isDirectory()) {
            throw new Error(`ENOENT: no such file or directory, stat '${abs_path}'`);
        }
        setCurrentDir(abs_path);
    }

    async ls() {
        console.log('path', getCurrentDir());
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

    static getAbsPath(path_string) {
        return path.isAbsolute(path_string) ? path_string : path.join(getCurrentDir(), path_string);
    }
}
