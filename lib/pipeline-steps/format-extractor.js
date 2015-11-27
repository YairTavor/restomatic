'use strict';

/**
 * Reads the request and expected response formats
 * @class FormatExtractor
 */
class FormatExtractor {
    extract(request) {
        // TODO: parse the request format from the url or request headers
        return {
            requestFormat: 'json',
            responseFormat: 'json'
        };
    }
}
module.exports = new FormatExtractor();
