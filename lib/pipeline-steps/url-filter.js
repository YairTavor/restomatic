'use strict';
const logger = require('./../logger');

module.exports = {
    process: (args) => {
        logger.debug('request filter start');

        return new Promise((resolve) => {
            // TODO: allow or block request per url
            resolve(args);
            logger.debug('request filter end');
        });
    }
};