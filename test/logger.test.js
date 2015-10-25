(function () {
    'use strict';

    var assert = require('assert'),
        logger = require('../lib/logger.js');

    /*eslint-disable no-console */
    describe('logger', function () {

        it('inherit console and extend it', function () {
            assert.equal(logger.log, console.log);
            assert.equal(logger.warn, console.warn);
            assert.equal(logger.error, console.error);
        });

        describe('logger debug functions', function () {
            var logHasBeenCalled = false,
                original = console.log;

            function log() {
                logHasBeenCalled = true;
            }

            before(function () {
                console.log = log;
            });

            after(function () {
                console.log = original;
                original = null;
            });

            beforeEach(function () {
                logHasBeenCalled = false;
            });

            it('debug writes to the console', function () {
                logger.isDebugMode = true;
                logger.debug('test');
                assert.equal(logHasBeenCalled, true);
            });

            it('debug will not write to the console when not in debug mode', function () {
                logger.isDebugMode = false;
                logger.debug('test');
                assert.equal(logHasBeenCalled, false);
            });
        });
    });
    /*eslint-enable no-console */
}());