(function () {
    'use strict';

    var assert = require('assert'),
        pipeline = require('../lib/pipeline.js'),
        q = require('q');

    describe('pipeline', function () {

        it('process queue of functions', function (done) {
            var functionOne,
                functionTwo,
                functionOneWasCalled = false,
                functionTwoWasCalled = false,
                queue;

            functionOne = function (args){
                var deferred = q.defer();

                functionOneWasCalled = true;
                args.one = true;
                deferred.resolve(args);

                return deferred.promise;
            };

            functionTwo = function (args){
                var deferred = q.defer();

                // make sure that functionOne was called
                // before functionTwo
                assert.equal(functionOneWasCalled, true);

                functionTwoWasCalled = true;
                args.two = true;
                deferred.resolve(args);

                return deferred.promise;
            };

            queue = [functionOne, functionTwo];

            q({})
            .then(pipeline.processQueue(queue))
            .then(function(result){

                // Check that the queue went threw function
                // one and two and that the argument that
                // was passed between them is the same object
                assert.equal(functionOneWasCalled, true);
                assert.equal(functionTwoWasCalled, true);
                assert.equal(result.one, true);
                assert.equal(result.two, true);
                done();
            });
        });

        it('pipeline is calling the core function by order', function(done){
            var assertions = {
                    headerParserWasCalled : false,
                    bodyParserWasCalled : false,
                    urlFilterWasCalled : false,
                    requestHandlerWasCalled : false,
                    responseHandlerWasCalled : false
                },
                fakeRequest = { url : ''},
                fakeResponse = { end : function(){ } };

            function mockPipelineStep(boolToSet){
                var deferred = q.defer();

                assertions[boolToSet] = true;
                deferred.resolve();

                return deferred.promise;
            }

            pipeline.getRequestSourceIP = function mockIp(){ return '' };
            pipeline.headerParse = function mockHeaderParser(){
                assert.equal(assertions.headerParserWasCalled, false);
                assert.equal(assertions.bodyParserWasCalled, false);
                assert.equal(assertions.urlFilterWasCalled, false);
                assert.equal(assertions.requestHandlerWasCalled, false);
                assert.equal(assertions.responseHandlerWasCalled, false);
                return mockPipelineStep('headerParserWasCalled');
            };

            pipeline.bodyParse = function mockBodyParser(){
                assert.equal(assertions.headerParserWasCalled, true);
                assert.equal(assertions.bodyParserWasCalled, false);
                assert.equal(assertions.urlFilterWasCalled, false);
                assert.equal(assertions.requestHandlerWasCalled, false);
                assert.equal(assertions.responseHandlerWasCalled, false);
                return mockPipelineStep('bodyParserWasCalled');
            };
            pipeline.urlFilter = function mockUrlFilter(){
                assert.equal(assertions.headerParserWasCalled, true);
                assert.equal(assertions.bodyParserWasCalled, true);
                assert.equal(assertions.urlFilterWasCalled, false);
                assert.equal(assertions.requestHandlerWasCalled, false);
                assert.equal(assertions.responseHandlerWasCalled, false);
                return mockPipelineStep('urlFilterWasCalled');
            };
            pipeline.requestHandling = function mockRequestHandling(){
                assert.equal(assertions.headerParserWasCalled, true);
                assert.equal(assertions.bodyParserWasCalled, true);
                assert.equal(assertions.urlFilterWasCalled, true);
                assert.equal(assertions.requestHandlerWasCalled, false);
                assert.equal(assertions.responseHandlerWasCalled, false);
                return mockPipelineStep('requestHandlerWasCalled');
            };
            pipeline.responseHandling = function mockResponseHandling(){
                assert.equal(assertions.headerParserWasCalled, true);
                assert.equal(assertions.bodyParserWasCalled, true);
                assert.equal(assertions.urlFilterWasCalled, true);
                assert.equal(assertions.requestHandlerWasCalled, true);
                assert.equal(assertions.responseHandlerWasCalled, false);
                return mockPipelineStep('responseHandlerWasCalled');
            };

            pipeline.postProcess.push(function(){
                assert.equal(assertions.headerParserWasCalled, true);
                assert.equal(assertions.bodyParserWasCalled, true);
                assert.equal(assertions.urlFilterWasCalled, true);
                assert.equal(assertions.requestHandlerWasCalled, true);
                assert.equal(assertions.responseHandlerWasCalled, true);
                done();
            });

            pipeline.start(null, fakeRequest, fakeResponse);
        });
    });
}());