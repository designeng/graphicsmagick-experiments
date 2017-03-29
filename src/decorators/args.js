import _ from 'underscore';

export default function args(...config) {
    return (target, name, descriptor) => {
        return {
            value: {
                create: {
                    module: target[name],
                    args: config
                }
            }
        }
    }
}