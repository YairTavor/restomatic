'use strict';

jest.dontMock('../lib/db-adapter.js');

const DbAdapter = require('../lib/db-adapter.js'),
    dbAdapter = new DbAdapter();

describe('DbAdapter', () => {
    it('has init function', () => {
        expect(dbAdapter.init).toBeTruthy();
        expect(() => {
            dbAdapter.init();
        }).toThrow();
    });

    it('has query function', () => {
        expect(dbAdapter.query).toBeTruthy();
        expect(() => {
            dbAdapter.query();
        }).toThrow();
    });
});