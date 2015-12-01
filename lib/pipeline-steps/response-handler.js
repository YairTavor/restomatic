'use strict';
const logger = require('./../logger');

module.exports = {
    process: (args) => {
        return new Promise((resolve) => {
            const responseCode = 200,
                responseType = {'Content-Type': 'text/plain'};

            // TODO: use the query object to render response
            // TODO: handle HEAD method (avoid rendering the resource)
            args.response.writeHead(responseCode, responseType);
            args.data.responseBody = 'Hello World\n';
            resolve(args);
            logger.debug(`Response meta: ${responseCode} ${JSON.stringify(responseType)}`);
            logger.debug('Response body: ' + args.data.responseBody);
        });
    }
};