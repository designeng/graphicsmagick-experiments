import when from 'when';
let Promise = when.promise;

import mongodb from 'mongodb';
import Grid from 'gridfs-stream';

export default function getFileFromDatabase(database, name) {

    let gfs = Grid(database, mongodb);

    return Promise((resolve, reject) => {
        let readstream = gfs.createReadStream({
            filename: name
        });

        readstream.on('error', function (err) {
            reject(err);
        });

        readstream.on('finish', function (res) {
            resolve(res);
        });
    });
}