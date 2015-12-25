'use strict';
const logger = require('./../logger');

module.exports = {
    process: (args) => {
        logger.debug('request filter start');
        // TODO: allow or block request per url
        logger.debug('request filter end');
        return args;
    }
};