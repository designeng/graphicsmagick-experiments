import fs from 'fs';

const readFile = (resolver, compDef, wire) => {
    let cache = {};
    wire(compDef.options).then(({
        directory,
        path,
        resolveError,
        noCache
    }) => {
        // add trailing slash if nessesary
        if(path && path.slice(1) !== '/') {
            path = `/${path}`;
        }
        let filePath = directory + path;
        console.log('filePath:::', filePath);
        if(!cache[filePath]) {
            fs.readFile(filePath, 'utf8', (error, content) => {
                if (error) {
                    let method = resolveError ? 'resolve' : 'reject';
                    resolver[method](error);
                } else {
                    if(!noCache) {
                        cache[filePath] = content;
                    }
                    resolver.resolve(content);
                }
            });
        } else {
            resolver.resolve(cache[filePath]);
        }
    })
}

export default function ReadFilePlugin(options) {
    return {
        factories: {
            readFile,
        }
    }
}