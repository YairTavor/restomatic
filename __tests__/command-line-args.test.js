'use strict';

jest.dontMock('../lib/command-line-args.js');

const commandLineArgs = require('../lib/command-line-args.js');

describe('Command line args', () => {
    const original = process.argv;

    beforeEach(() => {
        process.argv = ['node', 'appname'];
    });

    afterEach(() => {
        process.argv = original;
    });

    it('get simple command line arguments', () => {
        let result;

        process.argv.push('firstArg');
        process.argv.push('secondArg');

        result = commandLineArgs.get();
        expect(result).toEqual({
            firstArg: true,
            secondArg: true
        });
    });

    it('get key/value command line arguments', () => {
        let result;

        process.argv.push('firstArg=5');
        process.argv.push('secondArg=true');
        process.argv.push('thirdArg=false');
        process.argv.push('forthArg=test');

        result = commandLineArgs.get();
        expect(result).toEqual({
            firstArg: '5',
            secondArg: true,
            thirdArg: false,
            forthArg: 'test'
        });
    });

    it('works when no command line arguments exists', () => {
        const result = commandLineArgs.get();
        expect(result).toEqual({});
    });
});
