import when from 'when';
let Promise = when.promise;

import mongodb from 'mongodb';
import Grid from 'gridfs-stream';

export default function removeFileFromDatabase(database, name) {
    var gfs = Grid(database, mongodb);

    return Promise((resolve, reject) => {
        gfs.remove({filename: name}, (err) => {
            return err ? reject(err) : resolve();
        });
    });
}