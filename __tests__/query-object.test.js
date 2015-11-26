'use strict';

jest.dontMock('../lib/query-object.js');

const QueryObject = require('../lib/query-object.js');

describe('query object', () => {
    it('has all default properties set', () => {
        const queryObject = new QueryObject();

        expect(queryObject.action).toBe(QueryObject.ACTION_GET);
        expect(queryObject.entity).toBeNull();
        expect(queryObject.from).toBe(0);
        expect(queryObject.count).toBeNull();
        expect(queryObject.sort).toBeNull();
        expect(queryObject.ascending).toBe(false);
    });

    it('can be initialized in the constructor', () => {
        const queryObject = new QueryObject({
            action: QueryObject.ACTION_CREATE,
            entity: { id: 1 },
            from: 1,
            count: 100,
            sort: 'name',
            ascending: true
        });

        expect(queryObject.action).toBe(QueryObject.ACTION_CREATE);
        expect(queryObject.entity).toEqual({ id: 1 });
        expect(queryObject.from).toBe(1);
        expect(queryObject.count).toBe(100);
        expect(queryObject.sort).toBe('name');
        expect(queryObject.ascending).toBe(true);
    });

    it('query object validates the type of his properties', () => {
        const queryObject = new QueryObject();

        /*
         * assert - accept null, undefined and validValue. Throws for invalidValue. Convert false values to
         * fallbackValue.
         */
        function assertProperty(propertyName, validValue, invalidValue, emptyValue, fallbackValue) {
            expect(() => { queryObject[propertyName] = validValue; }).not.toThrow();
            expect(() => { queryObject[propertyName] = null; }).not.toThrow();
            expect(() => { queryObject[propertyName] = undefined; }).not.toThrow();
            expect(() => { queryObject[propertyName] = invalidValue; }).toThrow();
            queryObject[propertyName] = emptyValue;
            expect(queryObject[propertyName]).toBe(fallbackValue);
        }

        function assertMandatoryProperty(propertyName, validValue, invalidValue) {
            expect(() => { queryObject[propertyName] = validValue; }).not.toThrow();
            expect(() => { queryObject[propertyName] = invalidValue; }).toThrow();
        }

        assertMandatoryProperty('action', 'get', 'unknownAction');
        assertMandatoryProperty('entity', {}, 2);
        assertProperty('count', 2, 'aaa', 0, null);
        assertProperty('sort', 'aaa', 2, '', null);
        assertProperty('ascending', true, 2, false, true);
        assertMandatoryProperty('from', 2, 'aaa');
    });
});