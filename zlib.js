import fs from 'fs';
import zlib from 'zlib';
import { getCurrentDir, setCurrentDir, getAbsPath, validatePath } from './currentPosition.js';

export class ZLib {
    constructor() {}

    // + compress book.txt book.txt.br
    // - compress book1.txt book.txt.br
    // - compress diagrams book.txt.br
    async compress([path_to_file, path_to_destination]) {
        path_to_file = await validatePath(getAbsPath(path_to_file), { exists: true, isFile: true });
        if (!path_to_destination.endsWith('.br')) path_to_destination += '.br';
        path_to_destination = getAbsPath(path_to_destination);

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

    // + decompress book.txt.br bookDecompressed.txt
    // - decompress book.txt bookDecompressed.txt
    // - decompress book233.txt bookDecompressed.txt
    async decompress([path_to_file, path_to_destination]) {
        path_to_file = await validatePath(getAbsPath(path_to_file), { exists: true, isFile: true });
        path_to_destination = getAbsPath(path_to_destination);

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
