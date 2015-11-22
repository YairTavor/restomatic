'use strict';
const logger = require('./logger.js');

module.exports = {
    process: (args) => {
        logger.debug('header parser start');

        return new Promise((resolve) => {
            // TODO: parse the request format from the url or request headers
            args.data.requestFormat = 'json';

            resolve(args);
            logger.debug('header parser end');
        });
    }
};
