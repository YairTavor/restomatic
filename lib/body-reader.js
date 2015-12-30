'use strict';

const q = require('q'),
    Terminator = require('./terminator');

class BodyReader {
    shouldCheckBody(request) {
        const result = request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH';
        return result;
    }

    getBody(request, response) {
        const deferred = q.defer();
        let requestBody = '';
        request.on('data', (data) => {
            requestBody += data;
            if (requestBody.length > 1e6) {
                const terminator = new Terminator(request, response);
                requestBody = '';
                terminator.terminate(Terminator.codes.TOO_LARGE, '');
                request.connection.destroy();
            }
        });

        request.on('end', () => {
            deferred.resolve(requestBody);
        });

        return deferred.promise;
    }
}

module.exports = new BodyReader();