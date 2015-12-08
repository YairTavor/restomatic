'use strict';
const logger = require('./../logger'),
        Terminator = require('./../terminator');

module.exports = {
    process: (args) => {
        return new Promise((resolve) => {
            const terminator = new Terminator(args.request, args.response),
                responseType = terminator.getContentType();

            let responseCode = Terminator.codes.OK.code;


            return args.db.query(args.data.query).then(result => {
              // TODO: handle HEAD method (avoid rendering the resource)

              if(Array.isArray(result) && !result.length){
                responseCode = Terminator.codes.NO_CONTENT.code;
              }
              args.response.writeHead(responseCode, responseType);
              args.data.responseBody = terminator.getParser().serialize(result);

              resolve(args);

              logger.debug(`Response meta: ${responseCode} ${JSON.stringify(responseType)}`);
              logger.debug('Response body: ' + args.data.responseBody);
            });
        });
    }
};