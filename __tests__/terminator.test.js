'use strict';

jest.dontMock('../lib/terminator');
jest.setMock('../lib/pipeline-steps/format-extractor', {
    extract: () => {
        return { responseFormat: 'json' };
    }
});
jest.setMock('../lib/parsers', {
    search: () => ({
        mime: 'application/json',
        serialize: jest.genMockFunction()
    })
});

const Terminator = require('../lib/terminator');
let terminator;

describe('Terminator', () => {
    it('get content type', () => {
        terminator = new Terminator();
        expect(terminator.getContentType()).toEqual({'Content-Type': 'application/json'});
    });

    it('can end the request with a given code', () => {
        terminator = new Terminator(null, {
            writeHead: jest.genMockFunction(),
            end: jest.genMockFunction()
        });

        terminator.terminate(Terminator.codes.BAD_REQUEST, 'invalid request, dude');
        expect(terminator.response.end).toBeCalled();
    });
});