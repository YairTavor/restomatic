'use strict';

const url = require('url');

/**
 * Get the sorting values from query string or 'sort' header
 *
 * To get sorting working, use query string or header
 *
 *      // url:
 *      www.example.com/users?sort=name
 *
 *      // header
 *      $.ajax({
 *          method: 'GET',
 *          url: 'www.example.com/users'
 *          headers: {
 *              sort: 'name'
 *          }
 *      })
 *
 * If you pass a minus "-" sign before the sort value, the sorting will be descending instead of ascending
 *
 *      www.example.com/users?sort=-name
 *
 * @class SortingExtractor
 */
class SortingExtractor {
    getSortValue(request) {
        const parsedUrl = url.parse(request.url, true);
        let result = null;

        if (parsedUrl.query && parsedUrl.query.sort) {
            result = parsedUrl.query.sort.trim();
        }
        else if (request.headers && request.headers.sort) {
            result = request.headers.sort.trim();
        }

        return result;
    }

    normalizeSortValue(sortValue) {
        let result = null;

        if (sortValue) {
            result = sortValue;
            if (sortValue.startsWith('-')) {
                result = sortValue.substr(1);
            }
        }

        return result;
    }

    isAscending(sortValue) {
        let ascending = true;

        if (sortValue && sortValue.trim().startsWith('-')) {
            ascending = false;
        }

        return ascending;
    }

    extract(request) {
        const result = {
                ascending: true,
                sort: null
            },
            sortValue = this.getSortValue(request);

        if (sortValue) {
            result.ascending = this.isAscending(sortValue);
            result.sort = this.normalizeSortValue(sortValue);
        }

        return result;
    }
}

module.exports = new SortingExtractor();