(function () {
    'use strict';

    var DbAdapter = require('./db-adapter.js'),
        fs = require('fs'),
        path = require('path'),
        q = require('q'),
        logger = require('./logger.js');

    /**
     * Simple and dirty file db, does full write on every save or update.
     * Not recommended for production! This has serious concurrency and performance issues and is only meant to be used
     * as a rapid option for the early stages of development.
     *
     * @class FileDb
     * @extends DbAdapter
     * @param dbFolder
     * @constructor
     */
    function FileDb(dbFolder) {
        var self = this,
            fileEncoding = 'utf-8';

        this.getPath = function (entity) {
            return path.join(self.dbFolder, entity + '.db');
        };

        /**
         * Save the json object to a file
         *
         * @method persistDb
         * @private
         * @param {string} entity - the name of the entity collection
         * @param {Array} content - the array that contains all the documents of this entity
         * @returns promise
         */
        this.persistDb = function (entity, content) {
            var filePath = self.getPath(entity);

            content = JSON.stringify(content);
            return q.nfcall(fs.writeFile, filePath, content, fileEncoding);
        };

        /**
         * Load a db collection from the file system
         *
         * @method getDb
         * @param {string} entity - the name of the entity collection
         * @private
         * @returns promise - with the collection
         */
        this.getDb = function (entity) {
            var filePath = self.getPath(entity);

            return q.nfcall(fs.exists, filePath).then(function (exists) {
                if (!exists) {
                    // Generate the file if it doesn't exist
                    return self.persistDb(entity, []).then(function () {
                        return []; // new empty collection
                    });
                }
                else {
                    // Read file content and return it as an object
                    return q.nfcall(fs.readFile, filePath, fileEncoding).then(function (content) {
                        return JSON.parse(content);
                    });
                }
            });
        };

        /**
         * Path to the folder containing the db files.
         *
         * @property dbFolder
         * @type {string}
         */
        this.dbFolder = dbFolder;

        // see documentation inside db-adapter.js
        this.init = function () {
            var deferred = q.defer();

            /*
             * when you create your own adapter, this is where you open a connection to the db.
             * this is a file db, where each entity has it's own file, so no point opening a connection.
             * we make sure the folder exists and create it if not.
             */
            fs.exists(self.dbFolder, function (exists) {
                if (!exists) {
                    q.nfcall(fs.mkdir, self.dbFolder).then(function () {
                        deferred.resolve();
                    });
                }
                else {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        };

        // see documentation inside db-adapter.js
        this.query = function (queryObject) {
            if (queryObject.entity) {
                self.getDb(queryObject.entity).then(function (collection) {
                    logger.debug(JSON.stringify(collection));
                });
            }
        };
    }

    FileDb.prototype = new DbAdapter();
    module.exports = FileDb;


}());
