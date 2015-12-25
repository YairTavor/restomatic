'use strict';
const q = require('q'),
    logger = require('./../logger'),
    Terminator = require('./../terminator');

module.exports = {
    process: (args) => {
        const terminator = new Terminator(args.request, args.response),
            responseType = terminator.getContentType(),
            deferred = q.defer();

        let responseCode = Terminator.codes.OK.code;

        args.db.query(args.data.query).then(result => {
            // TODO: handle HEAD method (avoid rendering the resource)

            if (Array.isArray(result) && !result.length) {
                responseCode = Terminator.codes.NO_CONTENT.code;
            }
            args.response.writeHead(responseCode, responseType);
            args.data.responseBody = terminator.getParser().serialize(result);

            logger.debug(`Response meta: ${responseCode} ${JSON.stringify(responseType)}`);
            logger.debug('Response body: ' + args.data.responseBody);

            deferred.resolve(args);
        }, () => {
            deferred.reject(args);
        });

        return deferred.promise;
    }
};