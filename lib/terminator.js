'use strict';

const formatExtractor = require('./pipeline-steps/format-extractor'),
    parsers = require('./parsers');

/**
 * Class that is used to terminate (end) requests.
 */
class Terminator {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.parser;
    }

    getParser() {
        let format;

        if (!this.parser) {
            format = formatExtractor.extract(this.request);
            this.parser = parsers.search(format.responseFormat);
        }
        return this.parser;
    }

    getContentType() {
        return {'Content-Type': this.getParser().mime};
    }

    /**
     *
     *      {
     *          code: Terminator.codes.OK,
     *          body: {}, // What ever
      *         error: 'some explicit error message',
      *         errorCode: 'ERROR_ID' // constant error message
     *      }
     * @param options
     */
    responde(options) {

    }
}

Terminator.codes = {
    'OK': { code: 200, name: 'OK', description: 'success'},
    'CREATED': { code: 201, name: 'Created', description: 'a resource was successfully created'},
    'ACCEPTED': { code: 202, name: 'Accepted', description: 'an async operation was started'},
    'NO_CONTENT': {
        code: 204,
        name: 'No Content',
        description: 'success but with an intentionally empty response body'
    },
    'MOVED_PERMANENTLY': {
        code: 301,
        name: 'Moved Permanently',
        description: 'resource not available at this url anymore'
    },
    'NOT_MODIFIED': { code: 304, name: 'Not Modified', description: 'use cached version of this resource'},
    'TEMPORARY_REDIRECT': { code: 307, name: 'Temporary Redirect', description: 'redirect to a different url'},
    'BAD_REQUEST': { code: 400, name: 'Bad Request', description: 'request was not properly formed'},
    'UNAUTHORIZED': { code: 401, name: 'Unauthorized', description: 'bad credentials'},
    'FORBIDDEN': { code: 403, name: 'Forbidden', description: 'denies access regardless of authentication'},
    'NOT_FOUND': { code: 404, name: 'Not Found', description: 'URI doesn\'t map to a resource'},
    'METHOD_NOT_ALLOWED': { code: 405, name: 'Method Not Allowed', description: 'HTTP method isn\'t supported'},
    'NOT_ACCEPTABLE': { code: 406, name: 'Not Acceptable', description: 'the requested format isn\'t available'},
    'CONFLICT': { code: 409, name: 'Conflict', description: 'there is a problem with the state of the resource'},
    'UNSUPPORTED_MEDIA_TYPE': {
        code: 415,
        name: 'Unsupported Media Type',
        description: 'the type of payload can\'t be processed'
    },
    'INTERNAL_SERVER_ERROR': { code: 500, name: 'Internal Server Error', description: 'API malfunction'}

};

module.exports = Terminator;