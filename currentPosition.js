import os from 'os';
import path from 'path';
import fs from 'fs';

let currentPath = os.homedir();

export const setCurrentDir = path => {
    currentPath = path;
};

export const getCurrentDir = () => {
    return currentPath;
};

export const getAbsPath = path_string => {
    let abs_path = path.isAbsolute(path_string) ? path_string : path.join(getCurrentDir(), path_string);
    let abs_path_parsed = path.parse(abs_path);
    return path.join(abs_path_parsed.dir, abs_path_parsed.base);
};

export const isDir = async path_string => {
    try {
        let pathStat = await fs.promises.stat(path_string);
        return pathStat.isDirectory();
    } catch (err) {
        return false;
    }
};

export const exists = async path_string => {
    try {
        return await fs.promises.stat(path_string);
    } catch (err) {
        return false;
    }
};

export const validatePath = async (path_string, rules = {}) => {
    const { exists, notExists, isDir, isFile } = rules;

    if (exists || isFile || isDir) {
        let pathStat = await fs.promises.stat(path_string);

        if ((isFile && pathStat.isDirectory()) || (isDir && !pathStat.isDirectory())) {
            throw new Error(`ENOENT: no such file or directory, stat '${path_string}'`);
        }
    }

    if (notExists) {
        try {
            let pathStat = await fs.promises.stat(path_string);
            console.log(pathStat);
        } catch (err) {
            console.log('not exists');
        }
    }

    return path_string;
};
