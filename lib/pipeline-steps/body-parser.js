'use strict';
const logger = require('./../logger.js'),
    parsers = require('./../parsers.js');

module.exports = {
    process: (args) => {
        return new Promise((resolve) => {
            let parser = null;

            args.data.requestBody = null;

            if(args.request.body){
                parser = parsers.search(args.data.requestFormat);

                if(parser){
                    args.data.requestBody = parser.deserialize(args.request.body);
                }
                else {
                    // TODO: handle unfound parser
                }
            }

            resolve(args);

            logger.debug(parser? 'Parser used for body: ' + parser.name : 'Not using and body parser.');
            logger.debug('Request body: ' + (args.request.body || 'null' ));
        });
    }
};
