'use strict';

const url = require('url'),
    path = require('path');

/**
 * Reads the request and return the expected response formats.
 * For request format,
 * @class FormatExtractor
 */
class FormatExtractor {
    /**
     * Get the format used to parse the request body
     *
     * @method getRequestFormat
     * @param {http.IncomingMessage} request - the NodeJS request object
     * @param {string} responseFormat - the name or mime type of the response format
     * @returns {string} the name or mime type of the request format
     */
    getRequestFormat(request, responseFormat) {
        let result;

        if (request.headers['content-type']) {
            result = request.headers['content-type'];
        }
        else {
            result = responseFormat;
        }

        return result;
    }

    /**
     * Get the format used to serialize the response body
     *
     * @method getResponseFormat
     * @param {http.IncomingMessage} request - the NodeJS request object
     * @returns {string} the name or mime type of the response format
     */
    getResponseFormat(request) {
        const parsedUrl = url.parse(request.url),
            ext = path.extname(parsedUrl.pathname);
        let result = 'json';

        if (ext) {
            result = ext.replace('.', '');
        }
        else if (request.headers.accept) {
            result = request.headers.accept;
        }

        return result;
    }

    /**
     * Get the request and response formats used to parse and serialize the request and response body
     *
     * @method extract
     * @param {http.IncomingMessage} request - the NodeJS request object
     * @returns {{requestFormat: (string), responseFormat: (string)}}
     */
    extract(request) {
        let requestFormat, responseFormat, result;

        responseFormat = this.getResponseFormat(request);
        requestFormat = this.getRequestFormat(request, responseFormat);
        result = {
            requestFormat: requestFormat,
            responseFormat: responseFormat
        };

        return result;
    }
}
module.exports = new FormatExtractor();
