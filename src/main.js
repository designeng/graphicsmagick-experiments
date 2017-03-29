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

import removeFileFromDatabase from './removeFileFromDatabase';
import storeFileToDatabase from './storeFileToDatabase';

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

    filename: 'one.jpg',

    imageFile: {
        readFile: {
            directory: __dirname + '/../images',
            path: {$ref: 'filename'}
        }
    },

    @args(
        {$ref: 'imagesDb'},
        {$ref: 'filename'}
    )
    removeFileFromDatabase,

    @args(
        {$ref: 'imagesDb'},
        {$ref: 'filename'},
        {$ref: 'imageFile'},
        {$ref: 'removeFileFromDatabase'}
    )
    storeFileToDatabase,
}

wire(spec).then((context) => {
    let { imageFile } = context;

    when(context.destroy()).then(() => {
        process.exit();
    })
});