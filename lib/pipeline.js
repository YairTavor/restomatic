(function(){
    'use strict';

    var q = require('q'),
        headerParser = require('./header-parser.js'),
        bodyParser = require('./body-parser.js'),
        urlFilter = require('./url-filter.js'),
        requestHandler = require('./request-handler.js'),
        responseHandler = require('./response-handler.js'),
        QueryObject = require('./query-object.js'),
        logger = require('./logger.js');

    function Pipeline(){
        var self = this;

        /**
         * Execute functions in an array one after another.
         * Each function has to accept args object and return a promise.
         *
         * @param queue
         * @returns {Function}
         */
        this.processQueue = function(queue){
            return function(args){
                var result = q(args);
                queue.forEach(function (f) {
                    result = result.then(f);
                });

                return result;
            };
        };

        this.getRequestSourceIP = function(req){
            var ip = req.headers['X-Forwarded-For'] || req.connection.remoteAddress || null;
            return ip;
        };

        this.start = function(db, req, res){
            var args = {
                db : db,
                request : req,
                response : res,
                data : {
                    requestSourceIP : self.getRequestSourceIP(req),
                    requestFormat : null,
                    responseFormat : null,
                    requestBody : null,
                    responseBody : null,
                    isStaticFile : false,
                    query: new QueryObject()
                }
            };


            console.log('Incoming request from ' + args.data.requestSourceIP + ' to ' + req.url);

            return q(args)

            // Preprocessor
            .then(self.processQueue(self.preProcess))

            // Parse Request Headers
            .then(self.processQueue(self.beforeHeaderParse))
            .then(self.headerParse)
            .then(self.processQueue(self.afterHeaderParse))

            // Parse Request Body
            .then(self.processQueue(self.beforeBodyParse))
            .then(self.bodyParse)
            .then(self.processQueue(self.afterBodyParse))

            // Run Url Filter (Block unwanted urls)
            .then(self.processQueue(self.beforeUrlFilter))
            .then(self.urlFilter)
            .then(self.processQueue(self.afterUrlFilter))

            // Handle Request (execute REST handlers and functions)
            .then(self.processQueue(self.beforeRequestHandling))
            .then(self.requestHandling)
            .then(self.processQueue(self.afterRequestHandling))

            // Handle Response
            .then(self.processQueue(self.beforeResponseHandling))
            .then(self.responseHandling)
            .then(self.processQueue(self.afterResponseHandling))

            // Postprocessor
            .then(self.processQueue(self.postProcess))

            .then(function(args){
                    logger.debug('end response');
                    args.response.end(args.data.responseBody);
            });
        };

        this.preProcess = [];
        this.beforeHeaderParse = [];
        this.beforeBodyParse = [];
        this.beforeUrlFilter = [];
        this.beforeRequestHandling = [];
        this.beforeResponseHandling = [];

        this.headerParse = headerParser.process;
        this.bodyParse = bodyParser.process;
        this.urlFilter = urlFilter.process;
        this.requestHandling = requestHandler.process;
        this.responseHandling = responseHandler.process;

        this.afterHeaderParse = [];
        this.afterBodyParse = [];
        this.afterUrlFilter = [];
        this.afterRequestHandling = [];
        this.afterResponseHandling = [];
        this.postProcess = [];
    }

    module.exports = new Pipeline();
}());