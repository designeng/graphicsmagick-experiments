import _ from 'underscore';
import { MongoClient } from 'mongodb';
import pipeline from 'when/pipeline';

let activeDatabases = [];

function connectToDatabase(resolver, compDef, wire) {
    wire(compDef.options).then(({
        url,
        options
    }) => {
        const connectP = (url) => MongoClient.connect(url, options)

        let active = _.find(activeDatabases, { url });

        if(active && active[0] && active[0]['db']) {
            resolver.resolve(active);
        } else {
            pipeline([connectP], url).then((db) => {

                db.on('close', () => {
                    let errorMessage = `CLOSED MONGODB CONNECTION: ${url}`;
                    console.log(errorMessage);
                });

                activeDatabases.push({
                    db,
                    url
                });

                resolver.resolve(db);

            }).catch((error) => {
                resolver.reject(error);
            });
        }
    });
}

export default function connectToDatabasePlugin(options) {
    return {
        factories: {
            connectToDatabase
        },
        context: {
            shutdown: (resolver, wire) => {
                _.map(activeDatabases, (item) => {
                    // item['db'].close();
                    // console.log(`Closed connection to ${item['url']}`);
                });
                resolver.resolve();
            },
        }
    }
}