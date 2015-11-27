'use strict';

const QueryObject = require('./../query-object');

class ActionExtractor{
    extract(urlMethod) {
        let action;

        if (urlMethod === 'GET') {
            action = QueryObject.ACTION_GET;
        }
        else if (urlMethod === 'POST') {
            action = QueryObject.ACTION_CREATE;
        }
        else if (urlMethod === 'PUT') {
            action = QueryObject.ACTION_UPDATE;
        }
        else if (urlMethod === 'PATCH') {
            action = QueryObject.ACTION_PARTIAL_UPDATE;
        }
        else if (urlMethod === 'DELETE') {
            action = QueryObject.ACTION_DELETE;
        }
        else {
            action = QueryObject.ACTION_DEFAULT;
        }
        return action;
    }
}

module.exports = new ActionExtractor();