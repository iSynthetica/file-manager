import fs from 'fs';
import path from 'path';
import { getCurrentDir, setCurrentDir, getAbsPath, validatePath } from './currentPosition.js';

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
        let abs_path = await validatePath(getAbsPath(path_string));
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

    // + rn bookDecompressed.txt bookDecompressedRenamed.txt
    // - rn софія bookDecompressedRenamed.txt
    async rn([path_to_file, new_filename]) {
        path_to_file = await validatePath(getAbsPath(path_to_file), { isFile: true });
        let path_to_new_file = path.join(path.dirname(path_to_file), new_filename);
        await fs.promises.rename(path_to_file, path_to_new_file);

        console.log(`File ${path_to_file} renamed to ${new_filename}`);
    }

    // + mv /Users/apple/Downloads/fileToMove.txt /Users/apple/Downloads/diagrams
    async mv([path_to_file, path_to_new_directory]) {
        const { new_filename } = await this.__cpMv(path_to_file, path_to_new_directory, true);
        console.log(`File ${new_filename} moved to ${path_to_new_directory}`);
    }

    // + cp /Users/apple/Downloads/fileToCopy.txt /Users/apple/Downloads/diagrams
    async cp([path_to_file, path_to_new_directory]) {
        const { new_filename } = await this.__cpMv(path_to_file, path_to_new_directory);
        console.log(`File ${new_filename} copied to ${path_to_new_directory}`);
    }

    async __cpMv(path_to_file, path_to_new_directory, move = false) {
        path_to_file = await validatePath(getAbsPath(path_to_file), { isFile: true });
        path_to_new_directory = await validatePath(getAbsPath(path_to_new_directory), { isDir: true });
        let new_filename = path.parse(path_to_file).base;
        let path_to_new_file = path.join(path_to_new_directory, new_filename);

        await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(path_to_file);
            const writeStream = fs.createWriteStream(path_to_new_file);

            const stream = readStream.pipe(writeStream);
            stream.on('finish', () => resolve(true));
            stream.on('error', error => reject(error));
            readStream.on('error', error => reject(error));
            writeStream.on('error', error => reject(error));
        });

        if (move) await fs.promises.unlink(path_to_file);

        return { new_filename };
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
