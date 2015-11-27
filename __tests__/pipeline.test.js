'use strict';

jest.autoMockOff();

const Pipeline = require('../lib/pipeline.js');

describe('pipeline', () => {
    let pipeline,
        fakeRequest,
        fakeResponse;

    function mockPipelineAction(name) {
        return {
            process: (args) => {
                // collect names in inside array
                args.names = args.names || [];
                args.names.push(name);
                return Promise.resolve(args);
            }
        };
    }

    beforeEach(() => {
        pipeline = new Pipeline();

        fakeRequest = {url: '', headers: {}};
        fakeResponse = {
            end: () => {
            }
        };
        fakeRequest.headers['X-Forwarded-For'] = 'fake';

        pipeline.set(pipeline.steps.URL_FILTER, mockPipelineAction('url').process);
        pipeline.set(pipeline.steps.REQUEST_HANDLER, mockPipelineAction('request').process);
        pipeline.set(pipeline.steps.RESPONSE_HANDLER, mockPipelineAction('response').process);
    });

    it('process queue of functions by order', (done) => {
        pipeline.start(null, fakeRequest, fakeResponse).then((args) => {
            expect(args.names).toEqual(['url', 'request', 'response']);
            done();
        });

    });

    it('can add steps to the pipeline', (done) => {
        pipeline.insertFirst('preprocessor', mockPipelineAction('preprocessor').process);
        pipeline.insertAfter(pipeline.steps.REQUEST_HANDLER, 'extraHP', mockPipelineAction('extraHP').process);
        pipeline.insertLast('postprocessor', mockPipelineAction('postprocessor').process);

        pipeline.start(null, fakeRequest, fakeResponse).then((args) => {

            expect(args.names).toEqual(['preprocessor', 'url', 'request', 'extraHP', 'response', 'postprocessor']);
            done();
        });
    });
});