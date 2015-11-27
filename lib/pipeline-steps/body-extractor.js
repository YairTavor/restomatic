'use strict';
const logger = require('./../logger'),
    parsers = require('./../parsers');

/**
 * Convert the request body to object.
 * @class BodyExtractor
 */
class BodyExtractor {
    extract(request, requestFormat) {
        let parser = null,
            result = null;

        if (request.body) {
            parser = parsers.search(requestFormat);

            if (parser) {
                result = parser.deserialize(request.body);
            }
            else {
                // TODO: handle unfound parser
            }
        }

        logger.debug(parser ? 'Parser used for body: ' + parser.name : 'Not using and body parser.');

        return result;
    }
}

module.exports = new BodyExtractor();
