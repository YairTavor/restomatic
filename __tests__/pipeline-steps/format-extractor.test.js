'use strict';

jest.autoMockOff();

const formatExtractor = require('../../lib/pipeline-steps/format-extractor');

describe('format extractor', () => {
    let mockRequest;

    beforeEach(() => {
        mockRequest = {
            url: 'some/url/request',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json'
            }
        };
    });

    it('get the response format', () => {
        let responseFormat;

        // when url has no extension or header, fallback to 'json'.
        mockRequest.headers.accept = null;
        responseFormat = formatExtractor.getResponseFormat(mockRequest);
        expect(responseFormat).toBe('json');

        // when url has no extension, get from header
        mockRequest.headers.accept = 'application/json';
        responseFormat = formatExtractor.getResponseFormat(mockRequest);
        expect(responseFormat).toBe(mockRequest.headers.accept);

        // when url has extension, and request has header - url wins
        mockRequest.url = 'some/url.xml';
        responseFormat = formatExtractor.getResponseFormat(mockRequest);
        expect(responseFormat).toBe('xml');
    });

    it('get the request format', () => {
        const responseFormat = 'xml';
        let requestFormat;

        // when request has content type, use it
        requestFormat = formatExtractor.getRequestFormat(mockRequest, responseFormat);
        expect(requestFormat).toBe(mockRequest.headers['content-type']);

        // when request has no content type, fallback to response type
        mockRequest.headers['content-type'] = null;
        requestFormat = formatExtractor.getRequestFormat(mockRequest, responseFormat);
        expect(requestFormat).toBe(responseFormat);
    });

    it('extract both request and response format', () => {
        const formats = formatExtractor.extract(mockRequest);
        expect(formats).toEqual({
            requestFormat: 'application/json',
            responseFormat: 'application/json'
        });
    });
});