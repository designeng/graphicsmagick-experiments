import when from 'when';
let Promise = when.promise;

import mongodb from 'mongodb';
import { Readable } from 'stream';
import Grid from 'gridfs-stream';

export default function storeFileToDatabase(database, name, fileData) {
    let readableStream = new Readable();
    readableStream.push(fileData);
    readableStream.push(null);

    var gfs = Grid(database, mongodb);

    return Promise((resolve, reject) => {
        var writestream = gfs.createWriteStream({
            filename: name
        });
        writestream.on('error', function (error) {
            reject(error);
        });
        writestream.on('finish', function () {
            resolve(name);
        });
        readableStream.pipe(writestream);
    });
}