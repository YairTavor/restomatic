'use strict';

jest.dontMock('../lib/db-adapter.js');

const DbAdapter = require('../lib/db-adapter.js'),
    dbAdapter = new DbAdapter();

describe('DbAdapter', function () {
    it('has init function', function () {
        expect(dbAdapter.init).toBeTruthy();
        expect(() => {
            dbAdapter.init();
        }).toThrow();
    });

    it('has query function', function () {
        expect(dbAdapter.query).toBeTruthy();
        expect(() => {
            dbAdapter.query(null);
        }).toThrow();
    });
});

