import os from 'os';
import path from 'path';

// let currentPath = os.homedir();
let currentPath = '/Users/apple/Downloads';

export const setCurrentDir = (path) => {
    currentPath = path;
};

export const getCurrentDir = () => {
    return currentPath;
}

export const getAbsPath = (path_string) => {
    return path.isAbsolute(path_string) ? path_string : path.join(getCurrentDir(), path_string);
}