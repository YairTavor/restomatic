'use strict';

jest.dontMock('../lib/pluggable-queue.js');

const PluggableQueue = require('../lib/pluggable-queue.js');

describe('PluggableQueue', () => {
    let pluggableQueue;

    beforeEach(() => {
        pluggableQueue = new PluggableQueue();
    });

    it('can create empty queue', () => {
        expect(pluggableQueue.length).toBe(0);
    });

    it('can insert a new entry by index', () => {
        // the invalid index will be normilzed to equal the queue length
        pluggableQueue.insert(2000, 'key', 'value');
        expect(pluggableQueue.length).toBe(1);

        pluggableQueue.insert(0, 'keyFirst', 'valueFirst');
        expect(pluggableQueue.length).toBe(2);
    });

    it('can itterate over the values in a for-of loop', () => {
        const iterations = [];

        pluggableQueue.insert(0, 'keyFirst', 'valueFirst');
        pluggableQueue.insert(1, 'keySecond', 'valueSecond');
        pluggableQueue.insert(2, 'keyLast', 'valueLast');

        for (const value of pluggableQueue) {
            iterations.push(value);
        }

        expect(iterations.length).toBe(3);
        expect(iterations).toEqual(['valueFirst', 'valueSecond', 'valueLast']);
    });

    it('get all values as array', () => {
        pluggableQueue.insert(0, 'keyFirst', 'valueFirst');
        pluggableQueue.insert(1, 'keySecond', 'valueSecond');
        pluggableQueue.insert(2, 'keyLast', 'valueLast');

        expect(pluggableQueue.getValues()).toEqual(['valueFirst', 'valueSecond', 'valueLast']);
    });

    it('get all keys as array', () => {
        pluggableQueue.insert(0, 'keyFirst', 'valueFirst');
        pluggableQueue.insert(1, 'keySecond', 'valueSecond');
        pluggableQueue.insert(2, 'keyLast', 'valueLast');

        expect(pluggableQueue.getKeys()).toEqual(['keyFirst', 'keySecond', 'keyLast']);
    });

    it('can insert a new entry at the end of the queue', () => {
        pluggableQueue.insert(0, 'keyFirst', 'valueFirst');
        pluggableQueue.insertLast('keySecond', 'valueSecond');

        expect(pluggableQueue.length).toBe(2);
        expect(pluggableQueue.getValues()[0]).toBe('valueFirst');
        expect(pluggableQueue.getValues()[1]).toBe('valueSecond');
    });

    it('can insert a new entry at the beginning of the queue', () => {
        pluggableQueue.insert(0, 'keyFirst', 'valueFirst');
        pluggableQueue.insertFirst('keySecond', 'valueSecond');

        expect(pluggableQueue.length).toBe(2);
        expect(pluggableQueue.getValues()[0]).toBe('valueSecond');
        expect(pluggableQueue.getValues()[1]).toBe('valueFirst');
    });

    it('can remove entry by index', () => {
        pluggableQueue.insertFirst('keyName', 'value');
        expect(pluggableQueue.length).toBe(1);

        pluggableQueue.remove(0);
        expect(pluggableQueue.length).toBe(0);
    });

    it('can insert one entry before another using key', () => {
        pluggableQueue.insertFirst('keyFirst', 'valueFirst');
        pluggableQueue.insertBefore('keyFirst', 'keySecond', 'valueSecond');

        expect(pluggableQueue.length).toBe(2);
        expect(pluggableQueue.getValues()[0]).toBe('valueSecond');
        expect(pluggableQueue.getValues()[1]).toBe('valueFirst');

        expect(() => {
            pluggableQueue.insertBefore('non-existing-key');
        }).toThrow();
    });

    it('can insert one entry before another using key', () => {
        pluggableQueue.insertFirst('keyFirst', 'valueFirst');
        pluggableQueue.insertAfter('keyFirst', 'keySecond', 'valueSecond');

        expect(pluggableQueue.length).toBe(2);
        expect(pluggableQueue.getValues()[0]).toBe('valueFirst');
        expect(pluggableQueue.getValues()[1]).toBe('valueSecond');

        expect(() => {
            pluggableQueue.insertAfter('non-existing-key');
        }).toThrow();
    });

    it('can remove entry at a specific key', () => {
        pluggableQueue.insertFirst('keyFirst', 'valueFirst');
        expect(pluggableQueue.length).toBe(1);

        pluggableQueue.removeKey('keyFirst');
        expect(pluggableQueue.length).toBe(0);

        expect(() => {
            pluggableQueue.removeKey('non-existing-key');
        }).toThrow();
    });

    it('can replace one value with another on the same key', () => {
        pluggableQueue.insert(0, 'key', 'value');
        expect(pluggableQueue.getValues()[0]).toBe('value');
        expect(pluggableQueue.length).toBe(1);

        pluggableQueue.set('key', 'newValue');
        expect(pluggableQueue.getValues()[0]).toBe('newValue');
        expect(pluggableQueue.length).toBe(1);

        expect(() => {
            pluggableQueue.set('non-existing-key');
        }).toThrow();
    });
});