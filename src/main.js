import fs from 'fs';
import _ from 'underscore';
import when from 'when';
import wire from 'essential-wire';
import wireDebugPlugin from 'essential-wire/source/debug';

import mongodb from 'mongodb';
import { Readable } from 'stream';
import Grid from 'gridfs-stream';

import connectToDatabase from './plugins/connectToDatabase';
import readFile from './plugins/readFile';

import args from './decorators/args';

let Promise = when.promise;

const imagesDbUrl = 'mongodb://localhost:27017/images_storage';

const spec = {
    $plugins: [
        // wireDebugPlugin,
        connectToDatabase,
        readFile,
    ],

    imagesDb: {
        connectToDatabase: {
            url:  imagesDbUrl
        }
    },

    imageFile: {
        readFile: {
            directory: __dirname + '/../images',
            path: 'one.jpg'
        }
    },

    @args({$ref: 'imageFile'})
    storeImage: (imageFileData) => {

    },

    // download: {
    //     create: {
    //         module: download,
    //         args: [
    //             items
    //         ]
    //     }
    // },
}

wire(spec).then((context) => {
    let { imageFile } = context;
    
    console.log('IMAGE:::', imageFile);
    when(context.destroy()).then(() => {
        process.exit();
    })
});