(function () {
    'use strict';

    var assert = require('assert'),
        commandLineArgs = require('../lib/command-line-args.js');

    describe('Command line args', function () {
        var original = process.argv;

        beforeEach(function(){
            process.argv = ['node', 'appname'];
        });

        after(function(){
            process.argv = original;
        });

        it('get simple command line arguments', function () {
            var result;

            process.argv.push('firstArg');
            process.argv.push('secondArg');

            result = commandLineArgs.get();
            assert.deepEqual(result, {
                firstArg : true,
                secondArg : true
            });
        });

        it('get key/value command line arguments', function () {
            var result;

            process.argv.push('firstArg=5');
            process.argv.push('secondArg=true');
            process.argv.push('thirdArg=false');
            process.argv.push('forthArg=test');

            result = commandLineArgs.get();
            assert.deepEqual(result, {
                firstArg : '5',
                secondArg : true,
                thirdArg : false,
                forthArg : 'test'
            });
        });

        it('works when no command line arguments exists', function () {
            var result = commandLineArgs.get();
            assert.deepEqual(result, {});
        });
    });
}());