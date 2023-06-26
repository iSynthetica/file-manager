import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { getAbsPath, validatePath, exists, isDir } from './currentPosition.js';

export class ZLib {
    constructor() {}
    
    async compress([path_to_file, path_to_destination]) {
        path_to_file = await validatePath(getAbsPath(path_to_file), { exists: true, isFile: true });
        path_to_destination = getAbsPath(path_to_destination);

        let destIsDir = await isDir(path_to_destination);
        if (destIsDir) path_to_destination = path.join(path_to_destination, path.parse(path_to_file).base);
        if (!path_to_destination.endsWith('.br')) path_to_destination += '.br';

        let isExists = await exists(path_to_destination);
        if (isExists) throw new Error('File already exists');

        await new Promise((resolve, reject) => {
            const brotli = zlib.createBrotliCompress();
            const stream = fs
                .createReadStream(path_to_file)
                .pipe(brotli)
                .pipe(fs.createWriteStream(path_to_destination));
            stream.on('finish', () => resolve(true));
            stream.on('error', error => reject(error));
            brotli.on('error', error => reject(error));
        });

        console.log(`File ${path_to_file} compressed`);
    }

    async decompress([path_to_file, path_to_destination]) {
        path_to_file = await validatePath(getAbsPath(path_to_file), { exists: true, isFile: true });
        path_to_destination = getAbsPath(path_to_destination);

        let destIsDir = await isDir(path_to_destination);

        if (destIsDir) {
            let source_file_name = path.parse(path_to_file).base.split('.').slice(0, -1).join('.');
            path_to_destination = path.join(path_to_destination, source_file_name);
        }

        let isExists = await exists(path_to_destination);
        if (isExists) throw new Error('File already exists');

        await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(path_to_file);
            const brotli = zlib.createBrotliDecompress();
            const writeStream = fs.createWriteStream(path_to_destination);

            const stream = readStream.pipe(brotli).pipe(writeStream);
            stream.on('finish', () => resolve(true));
            stream.on('error', error => reject(error));
            brotli.on('error', error => reject(error));
        });

        console.log(`File ${path_to_file} decompressed`);
    }
}
