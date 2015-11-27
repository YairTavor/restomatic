'use strict';
const url = require('url'),
    QueryObject = require('./../query-object'),
    logger = require('./../logger.js');

class RequestHandler {
    process(args) {
        return new Promise((resolve) => {
            this.fillQueryObject(args);
            resolve(args);
            logger.debug('request handler end');
        });
    }

    fillQueryObject(args) {
        const parsedUrl = url.parse(args.request.url);

        args.data.query.action = this.getAction(parsedUrl.method);
        args.data.query.entityName = this.getEntityName(parsedUrl.pathname);
        args.data.query.entityBody = this.getEntityBody(parsedUrl.pathname, args.data.requestBody);
        args.data.query.from = this.getFrom();
        args.data.query.count = this.getCount();
        args.data.query.sort = this.getSort();
        args.data.query.ascending = this.getAscending();
    }

    getAction(urlMethod) {
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
        logger.debug('Action: ' + action);
        return action;
    }

    getEntityName(urlPath) {

    }

    getEntityBody(urlPath, requestBody) {

    }

    getFrom() {

    }

    getCount() {

    }

    getSort() {

    }

    getAscending() {

    }


}

module.exports = new RequestHandler();