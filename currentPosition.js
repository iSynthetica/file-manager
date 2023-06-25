import os from 'os';
import path from 'path';
import fs from 'fs';

// let currentPath = os.homedir();
let currentPath = '/Users/apple/Downloads';

export const setCurrentDir = path => {
    currentPath = path;
};

export const getCurrentDir = () => {
    return currentPath;
};

export const getAbsPath = path_string => {
    return path.isAbsolute(path_string) ? path_string : path.join(getCurrentDir(), path_string);
};

export const validatePath = async (path_string, rules = {}) => {
    const { exists, isDir, isFile } = rules;

    if (exists || isFile || isDir) {
        let pathStat = await fs.promises.stat(path_string);

        if ((isFile && pathStat.isDirectory()) || (isDir && !pathStat.isDirectory())) {
            throw new Error(`ENOENT: no such file or directory, stat '${path_string}'`);
        }
    }

    return path_string;
};
