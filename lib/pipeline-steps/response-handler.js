'use strict';
const logger = require('./../logger');

module.exports = {
    process: (args) => {
        return new Promise((resolve) => {
            let responseCode = 200,
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

/*
 200 "OK" indicates general success
 200 "OK" shouldn't be used to return error messages
 201 "Created" indicates a resource was successfully created
 202 "Accepted" indicates that an asynch operation was started
 204 "No Content" indicates success but with an intentionally empty response body
 301 "Moved Permanently" is used for relocated resources
 303 "See Other" tells the client to query a different URI
 304 "Not Modified" is used to save bandwidth
 307 "Temporary Redirect" means resubmit the query to a different URI
 400 "Bad Request" indicates a general failure
 401 "Unauthorized" indicates bad credentials
 403 "Forbidden" denies access regardless of authentication
 404 "Not Found" means the URI doesn't map to a resource
 405 "Method Not Allowed" means the HTTP method isn't supported
 406 "Not Acceptable" indicates the requested format isn't available
 409 "Conflict" indicates a problem with the state of the resource
 412 "Precondition Failed" is used for conditional operations
 415 "Unsupported Media Type" means the type of payload can't be processed
 500 "Internal Server Error" indicates an API malfunction
 */