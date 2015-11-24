'use strict';

const PluggableQueue = require('./pluggable-queue.js'),
    headerParser = require('./pipeline-steps/header-parser.js'),
    bodyParser = require('./pipeline-steps/body-parser.js'),
    urlFilter = require('./pipeline-steps/url-filter.js'),
    requestHandler = require('./pipeline-steps/request-handler.js'),
    responseHandler = require('./pipeline-steps/response-handler.js'),
    QueryObject = require('./query-object.js'),
    logger = require('./logger.js'),
    getRequestSourceIpSymbol = Symbol('getRequestSourceIP');

/**
 *
 * @class Pipeline
 */
class Pipeline extends PluggableQueue {
    constructor() {
        super();

        this.steps = {
            HEADER_PARSER: 'HeaderParser',
            BODY_PARSER: 'BodyParser',
            URL_FILTER: 'UrlFilter',
            REQUEST_HANDLER: 'RequestHandler',
            RESPONSE_HANDLER: 'ResponseHandler'
        };

        this.insertLast(this.steps.HEADER_PARSER, headerParser.process);
        this.insertLast(this.steps.BODY_PARSER, bodyParser.process);
        this.insertLast(this.steps.URL_FILTER, urlFilter.process);
        this.insertLast(this.steps.REQUEST_HANDLER, requestHandler.process);
        this.insertLast(this.steps.RESPONSE_HANDLER, responseHandler.process);
    }

    [getRequestSourceIpSymbol](req) {
        return req.headers['X-Forwarded-For'] || req.connection.remoteAddress || null;
    }

    start(db, req, res) {
        const args = {
            db: db,
            request: req,
            response: res,
            data: {
                requestSourceIP: this[getRequestSourceIpSymbol](req),
                requestFormat: null,
                responseFormat: null,
                requestBody: null,
                responseBody: null,
                isStaticFile: false,
                query: new QueryObject()
            }
        };
        let pipeline;

        logger.log('Incoming request from ' + args.data.requestSourceIP + ' to ' + req.url);

        // start the pipeline
        pipeline = Promise.resolve(args);

        // ittearte over all of the pipeline's action, and chain the ations to execute one after another
        for (const promise of this) {
            pipeline = pipeline.then(promise(args));
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
