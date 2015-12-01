'use strict';

jest.dontMock('../lib/terminator');

const Terminator = require('../lib/terminator');
let terminator;

describe('Terminator', () => {
    it('get content type', () => {
        terminator = new Terminator();
    });
});