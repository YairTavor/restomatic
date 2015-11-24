'use strict';

module.exports = {
    name: 'json',
    mime: ['application/json'],
    serialize: (obj) => {
        return JSON.stringify(obj);
    },
    deserialize: (json) => {
        return JSON.parse(json);
    }
};
