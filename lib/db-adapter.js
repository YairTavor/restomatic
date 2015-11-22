'use strict';

/**
 * Any database adapter should inherit and implement this class.
 * It contains the minimum necessary methods to work with different databases.
 *
 * @class DbAdapter
 * @constructor
 */
class DbAdapter {
    /**
     * open a connection to the db and perform other setup steps.
     *
     * @method init
     * @returns promise with the db object or connection object in it
     */
    init() {
        throw new Error('Db Adapter must implement the "init" method.');
    }

    /* eslint-disable no-unused-vars */
    // TODO: finish documenting the query object
    /**
     * Execute a query against the db
     *
     * @method query
     * @param {object} queryObject - this is a metadata object with instruction on the query that needs to be executed.
     * @param {string} queryObject.action - the CRUD action to take. Acceptable values are "get", "create", "update" or "delete".
     * @param {string} queryObject.entity - this is the entity name, i.e the collection. For example, 'users' or 'tasks'.
     * @param {string} queryObject.id -
     * @param {number} queryObject.from -
     * @param {number} queryObject.count -
     * @param {string} queryObject.sort -
     * @param {boolean}   queryObject.ascending -
     * @returns promise
     */
    query(queryObject) {
        throw new Error('Db Adapter must implement the "query" method.');
    }

    /* eslint-enable no-unused-vars */
}

module.exports = DbAdapter;