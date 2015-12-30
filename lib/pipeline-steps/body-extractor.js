'use strict';
const logger = require('./../logger'),
    parsers = require('./../parsers'),
    Terminator = require('./../terminator');

/**
 * Convert the request body to object.
 * @class BodyExtractor
 */
class BodyExtractor {
    extract(request, response, requestFormat) {
        let parser = null,
            result = null;

        if (request.body) {
            parser = parsers.search(requestFormat);

            try {
                result = parser.deserialize(request.body);
            }
            catch (err) {
                const terminator = new Terminator(request, response);
                terminator.terminate(Terminator.codes.BAD_REQUEST, err.message);
            }
        }

        logger.debug(parser ? 'Parser used for body: ' + parser.ext : 'Not using any body parser.');

        return result;
    }
}

module.exports = new BodyExtractor();
