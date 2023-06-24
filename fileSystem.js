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
}

export const ls = async path => {
    let dirContent = await fs.promises.readdir(path, { withFileTypes: true });

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
};
