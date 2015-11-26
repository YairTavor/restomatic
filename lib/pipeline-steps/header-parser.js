'use strict';
const logger = require('./../logger.js');

module.exports = {
    process: (args) => {
        return new Promise((resolve) => {
            // TODO: parse the request format from the url or request headers
            args.data.requestFormat = 'json';
            args.data.responseFormat = 'json';
            resolve(args);
            logger.debug('Request Format: ' + args.data.requestFormat);
            logger.debug('Response Format: ' + args.data.responseFormat);
        });
    }
};
