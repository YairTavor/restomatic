'use strict';

const PluggableQueue = require('./pluggable-queue'),
    q = require('q'),
    sourceIpExtractor = require('./pipeline-steps/source-ip-extractor'),
    urlFilter = require('./pipeline-steps/url-filter'),
    requestHandler = require('./pipeline-steps/request-handler'),
    responseHandler = require('./pipeline-steps/response-handler'),
    QueryObject = require('./query-object'),
    logger = require('./logger');

/**
 * Pass the request and other object through a pipeline thar processes the request and handle the response using
 * several steps.
 * @class Pipeline
 */
class Pipeline extends PluggableQueue {
    constructor() {
        super();

        this.steps = {
            URL_FILTER: 'UrlFilter',
            REQUEST_HANDLER: 'RequestHandler',
            RESPONSE_HANDLER: 'ResponseHandler'
        };
        this.insertLast(this.steps.URL_FILTER, urlFilter.process);
        this.insertLast(this.steps.REQUEST_HANDLER, requestHandler.process);
        this.insertLast(this.steps.RESPONSE_HANDLER, responseHandler.process);
    }

    start(db, request, response) {
        let args = {
                db: db,
                request: request,
                response: response,
                data: {
                    requestSourceIP: sourceIpExtractor.extract(request),
                    requestFormat: null,
                    responseFormat: null,
                    requestBody: null,
                    responseBody: null,
                    query: new QueryObject()
                }
            },
            pipeline;

        logger.log(`Incoming ${request.method} request from ${args.data.requestSourceIP || 'unknown ip'} to ${request.url}`);

        // start the pipeline
        pipeline = q(args);

        // iterate over all of the pipeline's action, and chain the actions to execute one after another
        for (const promise of this) {
            pipeline = pipeline.then(promise);
        }

        // finish by ending the response
        pipeline.then((passedArgs) => {
            logger.debug('end response');
            passedArgs.response.end(passedArgs.data.responseBody);
        });

        return pipeline;
    }
}

module.exports = Pipeline;
