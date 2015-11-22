'use strict';
const url = require('url'),
    QueryObject = require('./query-object'),
    logger = require('./logger.js');

function getAction(urlMethod) {
    let action;

    if (urlMethod === 'GET') {
        action = QueryObject.ACTION_GET;
    }
    else if (urlMethod === 'POST') {
        action = QueryObject.ACTION_CREATE;
    }
    else if (urlMethod === 'PUT' || urlMethod === 'PATCH') {
        // TODO: consider patch to trigger a ACTION_PARTIAL_UPDATE instead of ACTION_UPDATE
        action = QueryObject.ACTION_UPDATE;
    }
    else if (urlMethod === 'DELETE') {
        action = QueryObject.ACTION_DELETE;
    }
    else {
        action = QueryObject.ACTION_DEFAULT;
    }

    return action;
}

function getEntity(urlPath) {

}

function getId(urlPath) {

}

function getFrom() {

}

function getCount() {

}

function getSort() {

}

function getAscending() {

}

function fillQueryObject(args) {
    var parsedUrl = url.parse(args.request.url);

    args.data.query.action = getAction(parsedUrl.method);
    args.data.query.entity = getEntity(parsedUrl.pathname);
    args.data.query.id = getId(parsedUrl.pathname);
    args.data.query.from = getFrom();
    args.data.query.count = getCount();
    args.data.query.sort = getSort();
    args.data.query.ascending = getAscending();
}

module.exports = {
    process: (args) => {
        logger.debug('request handler start');

        return new Request((resolve) => {
            fillQueryObject(args);
            resolve(args);
            logger.debug('request handler end');
        });
    },
    getAction: getAction,
    getEntity: getEntity,
    getId: getId,
    getFrom: getFrom,
    getCount: getCount,
    getSort: getSort,
    getAscending: getAscending,
    fillQueryObject: fillQueryObject
};