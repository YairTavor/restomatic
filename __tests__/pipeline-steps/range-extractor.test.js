'use strict';

jest.dontMock('../../lib/pipeline-steps/range-extractor');

const rangeExtractor = require('../../lib/pipeline-steps/range-extractor');

describe('RangeExtractor', () => {
    it('extract entity from url or headers', () => {
        const query = { range: null };
        let range;

        // Normal range
        query.range = '1-10';
        range = rangeExtractor.extract(query);
        expect(range.from).toBe(1);
        expect(range.count).toBe(10);

        query.range = '100-200';
        range = rangeExtractor.extract(query);
        expect(range.from).toBe(100);
        expect(range.count).toBe(101);

        // Negative range (get from the end)
        query.range = '-100';
        range = rangeExtractor.extract(query);
        expect(range.from).toBe(-100);
        expect(range.count).toBeNull();

        // Positive range (get from this point to the end)
        query.range = '500';
        range = rangeExtractor.extract(query);
        expect(range.from).toBe(500);
        expect(range.count).toBeNull();

        // Invalid range - from bigger than to
        query.range = '200-100';
        range = rangeExtractor.extract(query);
        expect(range).toBeNull();

        query.range = '-20--10';
        range = rangeExtractor.extract(query);
        expect(range).toBeNull();

        query.range = '-1-10';
        range = rangeExtractor.extract(query);
        expect(range).toBeNull();

        // invalid range - gibberish
        query.range = 'sdfsdf';
        range = rangeExtractor.extract(query);
        expect(range).toBeNull();

        query.range = '10sdfsdf';
        range = rangeExtractor.extract(query);
        expect(range).toBeNull();
    });
});