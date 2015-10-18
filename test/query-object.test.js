(function () {
    'use strict';

    var assert = require('assert'),
        QueryObject = require('../lib/query-object.js');

    describe('query object', function () {
        it('query object has all default properties set', function () {
            var queryObject = new QueryObject();

            assert.equal(queryObject.entity, null);
            assert.equal(queryObject.id, null);
            assert.equal(queryObject.from, 0);
            assert.equal(queryObject.count, null);
            assert.equal(queryObject.sort, null);
            assert.equal(queryObject.ascending, false);
        });

        it('object can be initialized in the constructor', function () {
            var queryObject = new QueryObject({
                entity: 'a',
                id: 'b',
                from: 1,
                count: 100,
                sort: 'name',
                ascending: true
            });

            assert.equal(queryObject.entity, 'a');
            assert.equal(queryObject.id, 'b');
            assert.equal(queryObject.from, 1);
            assert.equal(queryObject.count, '100');
            assert.equal(queryObject.sort, 'name');
            assert.equal(queryObject.ascending, true);
        });

        it('query object validates the type of his properties', function () {
            var queryObject = new QueryObject();

            /*
             * assert - accept null, undefined and validValue. Throws for invalidValue. Convert false values to
             * fallbackValue.
             */
            function assertProperty(propertyName, validValue, invalidValue, emptyValue, fallbackValue) {
                assert.doesNotThrow(function () {
                    queryObject[propertyName] = validValue;
                });
                assert.doesNotThrow(function () {
                    queryObject[propertyName] = null;
                });
                assert.doesNotThrow(function () {
                    queryObject[propertyName] = undefined;
                });
                assert.throws(function () {
                    queryObject[propertyName] = invalidValue;
                });
                queryObject[propertyName] = emptyValue;
                assert.equal(queryObject[propertyName], fallbackValue);
            }

            assertProperty('entity', 'aaa', 2, '', null);
            assertProperty('id', 'aaa', 2, '', null);
            assertProperty('count', 2, 'aaa', 0, null);
            assertProperty('sort', 'aaa', 2, '', null);
            assertProperty('ascending', true, 2, false, true);
        });
    })

}());