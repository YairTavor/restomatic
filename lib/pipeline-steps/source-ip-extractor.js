'use strict';

class SourceIpExtractor {
    extract(request) {
        return request.headers['X-Forwarded-For'] || request.connection.remoteAddress || null;
    }
}

module.exports = new SourceIpExtractor();
