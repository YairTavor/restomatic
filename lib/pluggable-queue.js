'use strict';

const queueSymbol = Symbol('queue'),
    normalizedIndexSymbol = Symbol('normalizedIndex'),
    findIndexForKeySymbol = Symbol('findIndexForKey');

/**
 * Allows you to handle an iterateable queue that is managed by keys and keeps order.
 *
 *      const pluggableQueue = new PluggableQueue();
 *      pluggableQueue.insertFirst('myFirstAction', function(){ console.log('A'); });
 *      pluggableQueue.insertBefore('myFirstAction', 'myActualFirstAction', function(){ console.log('B'); });
 *      pluggableQueue.insertAfter('myActualFirstAction', 'mySecondAction', function(){ console.log('C'); });
 *      pluggableQueue.insertLast('myLastAction', function(){ console.log('D'); });
 *
 *      for(let func of pluggableQueue){
 *          func();
 *      }
 *
 *      // OUTPUTS: B C A D
 *
 * You could use anything you like for a key or a value, but know that when using key functions (insertFirst,
 * insertBefore, etc) keys are compared using strict comparison (===). So no symbols please :)
 *
 * class PluggableQueue
 */
class PluggableQueue {
    constructor() {
        /**
         * Private property that holds the actual queue
         * @property queueSymbol
         * @type {Array}
         * @private
         */
        this[queueSymbol] = [];

        /**
         * The length of the queue
         * @property length
         * @type {number}
         */
        Object.defineProperty(this, 'length', {
            enumerable: true,
            configurable: false,
            get: () => this[queueSymbol].length
        });
    }

    /**
     * Iterator that allows using the PluggableQueue inside for-of loops
     * @private
     */
    *[Symbol.iterator]() {
        yield* this[queueSymbol].map(i => i.value);
    }

    /**
     * Make sure that a given index is not outside the bounds of the queue length
     * @param {int} index
     * @returns {int} index that can be safely use on the queue.
     * @private
     */
    [normlizedIndexSymbol](index) {
        let normalizedIndex = index;

        if (index > this.length) {
            normalizedIndex = this.length;
        }
        else if (index < 0) {
            normalizedIndex = 0;
        }

        return normalizedIndex;
    }

    /**
     * Get the index of a specific key. Returns -1 if key was not found.
     * @param {*} key - the key of the entity you look for.
     * @returns {number} index of the entity, or -1 if not found.
     * @private
     */
    [findIndexForKeySymbol](key) {
        let keyIndex = -1;

        for (let i = 0; i < this.length; i += 1) {
            if (this[queueSymbol][i].key === key) {
                keyIndex = i;
                break;
            }
        }

        return keyIndex;
    }

    /**
     * Get all keys as an array.
     * @returns {Array} keys
     */
    getKeys() {
        return this[queueSymbol].map(keyValuePair => keyValuePair.key);
    }

    /**
     * Get all values as an array
     * @returns {Array} values
     */
    getValues() {
        return this[queueSymbol].map(keyValuePair => keyValuePair.value);
    }

    /**
     * Insert a new entity at a given index
     * @param {number} index - where to insert the new entity
     * @param {*} key - the key of the new entity
     * @param {*} value - the value of the new entity
     */
    insert(index, key, value) {
        const queue = this[queueSymbol],
            normalizedIndex = this[normalizedIndexSymbol](index);

        if (this.length === 0) {
            queue.push({key: key, value: value});
        }
        else {
            queue.splice(normalizedIndex, 0, {key: key, value: value});
        }
    }

    /**
     * Remove an entity at a given position
     * @param {number} index - the index of the entity to remove
     */
    remove(index) {
        const normalizedIndex = this[normalizedIndexSymbol](index);

        if (this.length) {
            this[queueSymbol].splice(normalizedIndex, 1);
        }
    }

    /**
     * Remove an entity by a given key
     * @param {*} key - key of the entity to remove
     * @throws when key is not found
     */
    removeKey(key) {
        const keyIndex = this[findIndexForKeySymbol](key);
        if (keyIndex > -1) {
            this.remove(keyIndex);
        }
        else {
            throw new Error(`key "${key}" could not be found in the queue`);
        }
    }

    /**
     * Add entity to the beginning of the queue
     * @param {*} key - the key of the entity
     * @param {*} value - the value of the entity
     */
    insertFirst(key, value) {
        this.insert(0, key, value);
    }

    /**
     * Add entity to the end of the queue
     * @param {*} key - the key of the entity
     * @param {*} value - the value of the entity
     */
    insertLast(key, value) {
        this.insert(this[queueSymbol].length, key, value);
    }

    /**
     * Add one entity before another
     * @param {*} beforeKey - the key of the existing entity
     * @param {*} key - the key of the entity to insert
     * @param {*} value - the value of the entity to insert
     * @throws if the existing key does not exist.
     */
    insertBefore(beforeKey, key, value) {
        const keyIndex = this[findIndexForKeySymbol](beforeKey);

        if (keyIndex > -1) {
            this.insert(keyIndex, key, value);
        }
        else {
            throw new Error(`key "${beforeKey}" could not be found in the queue`);
        }
    }

    /**
     * Add one entity after another
     * @param {*} afterKey - the key of the existing entity
     * @param {*} key - the key of the entity to insert
     * @param {*} value - the value of the entity to insert
     * @throws if the existing key does not exist.
     */
    insertAfter(afterKey, key, value) {
        const keyIndex = this[findIndexForKeySymbol](afterKey);

        if (keyIndex > -1) {
            this.insert(keyIndex + 1, key, value);
        }
        else {
            throw new Error(`key "${afterKey}" could not be found in the queue`);
        }
    }

    /**
     * Update the value of an existing key
     * @param {*} key - the key of the entity to update
     * @param {*} value - the new value
     * @throws if the key does not exist.
     */
    set(key, value) {
        const keyIndex = this[findIndexForKeySymbol](key);

        if (keyIndex > -1) {
            this[queueSymbol][keyIndex].value = value;
        }
        else {
            throw new Error(`key "${key}" could not be found in the queue`);
        }
    }
}

module.exports = PluggableQueue;
