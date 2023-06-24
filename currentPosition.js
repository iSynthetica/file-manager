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

export const up = () => {
    let currentPathArray = currentPath.split(path.sep);

    if (currentPathArray.length > 1) {
        currentPathArray.pop();
        currentPath = currentPathArray.length === 1 ? '/' : currentPathArray.join(path.sep);
    }
}
