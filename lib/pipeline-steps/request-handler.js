'use strict';
const url = require('url'),
    formatExtractor = require('./format-extractor'),
    bodyExtractor = require('./body-extractor'),
    entityExtractor = require('./entity-extractor'),
    rangeExtractor = require('./range-extractor'),
    sortingExtractor = require('./sorting-extractor'),
    actionExtractor = require('./action-extractor'),
    logger = require('./../logger');

function fillQueryObject(args) {

    let parsedUrl, range, formats, sorting;

    parsedUrl = url.parse(args.request.url, true);
    range = rangeExtractor.extract(parsedUrl.query, args.request.headers);
    formats = formatExtractor.extract(args.request);
    sorting = sortingExtractor.extract();

    args.data.requestFormat = formats.requestFormat;
    args.data.responseFormat = formats.responseFormat;
    args.data.requestBody = bodyExtractor.extract(args.request, formats.requestFormat);

    args.data.query.action = actionExtractor.extract(parsedUrl.method);
    args.data.query.entity = entityExtractor.extract(parsedUrl.pathname, args.data.requestBody);
    args.data.query.from = range ? range.from : 0;
    args.data.query.count = range ? range.count : null;
    /*args.data.query.sort = sorting;
     args.data.query.ascending = sorting;*/

    logger.debug('Request data: ' + JSON.stringify(args.data, null, '\t'));
}

class RequestHandler {


    process(args) {
        const promise = (resolve) => {
            fillQueryObject(args);
            resolve(args);
        };
        return new Promise(promise);
    }

}

module.exports = new RequestHandler();