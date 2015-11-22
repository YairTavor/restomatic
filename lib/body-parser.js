'use strict';
const logger = require('./logger.js');

module.exports = {
    process: (args) => {
        logger.debug('body parser start');

        return new Promise((resolve) => {
            // TODO: use plugin to parse body from fromats to json
            resolve(args);
            logger.debug('body parser end');
        });
    }
};
