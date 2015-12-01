'use strict';

/**
 * Handle conversion of json to objects and vice versa.
 * @class jsonParser
 */
module.exports = {
    ext: 'json',
    mime: 'application/json',
    serialize: (obj) => {
        return JSON.stringify(obj);
    },
    deserialize: (json) => {
        return JSON.parse(json);
    }
};
