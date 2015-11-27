'use strict';

const normalRange = /^\d+-\d*$/,
    negavieRange = /^-\d+$/,
    positiveRange = /^\d+$/;

class RangeExtractor {
    extract(query, headers) {
        let result = null;

        if (query && query.range) {
            result = this.extractRange(query.range);
        }
        else if (headers.range) {
            result = this.extractRange(headers.range);
        }
        return result;
    }

    extractRange(rangeString) {
        let range = null;

        if (negavieRange.test(rangeString) || positiveRange.test(rangeString)) {
            range = {
                from: parseInt(rangeString, 10),
                count: null
            };
        }
        else if (normalRange.test(rangeString)) {
            range = this.getNormalRange(rangeString);
        }

        return range;
    }

    getNormalRange(rangeString) {
        const rangeParts = rangeString.split('-', 2).map(part => parseInt(part, 10));
        let range = null;

        if (rangeParts[1] > rangeParts[0]) {
            range = {
                from: rangeParts[0],
                count: (rangeParts[1] - rangeParts[0]) + 1
            };
        }
        return range;
    }
}

module.exports = new RangeExtractor();