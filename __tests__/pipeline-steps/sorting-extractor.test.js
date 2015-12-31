'use strict';

jest.autoMockOff();

const sortingExtractor = require('../../lib/pipeline-steps/sorting-extractor');

describe('sorting extractor', () => {
    let mockRequest;

    beforeEach(() => {
        mockRequest = {
            url: 'some/url?sort=name',
            headers: {
                sort: 'age'
            }
        };
    });

    it('get sorting value from query string or header', () => {
        let result;

        // when both query and header exist, get the query value
        result = sortingExtractor.getSortValue(mockRequest);
        expect(result).toBe('name');

        // when header exist, take it from header
        mockRequest.url = 'some/url';
        result = sortingExtractor.getSortValue(mockRequest);
        expect(result).toBe('age');

        // when both are mossing, sorting is null
        delete mockRequest.headers.sort;
        result = sortingExtractor.getSortValue(mockRequest);
        expect(result).toBe(null);
    });

    it('get ascending or descending direction', () => {
        let result;

        result = sortingExtractor.isAscending('update');
        expect(result).toBe(true);

        result = sortingExtractor.isAscending('-update');
        expect(result).toBe(false);

        result = sortingExtractor.isAscending('');
        expect(result).toBe(true);

        result = sortingExtractor.isAscending();
        expect(result).toBe(true);
    });

    it('normalize the sort value', () => {
        let result;

        result = sortingExtractor.normalizeSortValue('name');
        expect(result).toBe('name');

        result = sortingExtractor.normalizeSortValue('-name');
        expect(result).toBe('name');

        result = sortingExtractor.normalizeSortValue('');
        expect(result).toBe(null);
    });

    it('extract sorting object', () => {
        const result = sortingExtractor.extract(mockRequest);
        expect(result).toEqual({
            ascending: true,
            sort: 'name'
        });
    });
});
