'use strict';

jest.dontMock('../lib/logger.js');

const logger = require('../lib/logger.js');

/* eslint-disable no-console */
describe('logger', () => {
    it('inherit console and extend it', () => {
        expect(logger.log).toBe(console.log);
        expect(logger.warn).toBe(console.warn);
        expect(logger.error).toBe(console.error);
    });

    describe('logger debug functions', () => {
        let logHasBeenCalled = false,
            original = console.log;

        function log() {
            logHasBeenCalled = true;
        }

        beforeEach(() => {
            console.log = log;
            logHasBeenCalled = false;
        });

        afterEach(() => {
            console.log = original;
            original = null;
        });

        it('debug writes to the console', () => {
            logger.isDebugMode = true;
            logger.debug('test');
            expect(logHasBeenCalled).toBe(true);
        });

        it('debug will not write to the console when not in debug mode', () => {
            logger.isDebugMode = false;
            logger.debug('test');
            expect(logHasBeenCalled).toBe(false);
        });
    });
});
/* eslint-enable no-console */
