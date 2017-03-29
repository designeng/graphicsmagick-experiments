import _ from 'underscore';

export default function args(...config) {
    return (target, name, description) => {
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