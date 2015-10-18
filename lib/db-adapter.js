(function(){
    'use strict';

    /**
     * Any database adapter should inherit and implement this class.
     * It contains the minimum necessary methods to work with different databases.
     *
     * @class DbAdapter
     * @constructor
     */
    module.exports = function DbAdapter(){
        /**
         * open a connection to the db and perform other setup steps.
         *
         * @method init
         * @returns promise with the db object or connection object in it
         */
        this.init = function(){
            throw new Error('Db Adapter must implement the "init" method.');
        };

        /**
         * Execute a query against the db
         *
         * @method query
         * @param {object} queryObject - this is a metadata object with instruction on the query that needs to be executed.
         * @param {string} queryObject.entity - this is the entity name, i.e the collection. For example, 'users' or 'tasks'.
         * @returns promise
         */
        this.query = function(queryObject){
            throw new Error('Db Adapter must implement the "query" method.');
        }
    }
}());