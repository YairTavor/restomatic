'use strict';

const DbAdapter = require('./db-adapter'),
    q = require('q'),
    fs = require('fs'),
    path = require('path'),
    logger = require('./logger');

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
class FileDb extends DbAdapter {

    constructor(dbFolder) {
        super();

        /**
         * Set the type of file encoding
         *
         * @property fileEncoding
         * @type {string}
         */
        this.fileEncoding = 'utf-8';

        /**
         * Path to the folder containing the db files.
         *
         * @property dbFolder
         * @type {string}
         */
        this.dbFolder = dbFolder;
    }

    getPath(entity) {
        return path.join(this.dbFolder, entity.name + '.db');
    }

    /**
     * Save the json object to a file
     *
     * @method persistDb
     * @param {Entity} entity - the name of the entity collection
     * @param {Array} content - the array that contains all the documents of this entity
     * @returns {Promise}
     */
    persistDb(entity, content) {
        const filePath = this.getPath(entity),
            stringContent = JSON.stringify(content),
            deferred = q.defer();

        fs.writeFile(filePath, stringContent, this.fileEncoding, (err) => {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    /**
     * Load a db collection from the file system
     *
     * @method getDb
     * @param {string} entity - the name of the entity collection
     * @private
     * @returns {Promise} - with the collection
     */
    getDb(entity) {
        const filePath = this.getPath(entity),
            deferred = q.defer();

        fs.exists(filePath, (exists) => {
            if (!exists) {
                // Generate the file if it doesn't exist
                this.persistDb(entity, []).then(() => {
                    deferred.resolve([]); // new empty collection
                });
            }
            else {
                // Read file content and return it as an object
                fs.readFile(filePath, this.fileEncoding, (err, content) => {
                    if (err) {
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve(JSON.parse(content));
                    }
                });
            }
        });

        return deferred.promise;
    }

    // see documentation inside db-adapter.js
    init() {
        const deferred = q.defer();
        /*
         * when you create your own adapter, this is where you open a connection to the db.
         * this is a file db, where each entity has it's own file, so no point opening a connection.
         * we make sure the folder exists and create it if not.
         */

        fs.exists(this.dbFolder, (exists) => {
            if (!exists) {
                fs.mkdir(this.dbFolder, (err) => {
                    if (err) {
                        deferred.reject();
                    }
                    else {
                        deferred.resolve();
                    }
                });
            }
            else {
                deferred.resolve();
            }
        });

        return deferred.promise;
    }

    extractChild(dbResultEntity, entity) {
        return dbResultEntity;
    }

    getEntity(entity) {
        return this.getDb(entity.name).then((collection) => {
            console.log('after getDB');
            let result;

            if (entity.id) {
                result = collection.filter(item => item.id === entity.id);
                if (entity.hasChild()) {
                    result = this.extractChild(result, entity);
                }
            }
            else {
                result = collection;
            }
            return result;
        });
    }

    // see documentation inside db-adapter.js
    query(queryObject) {
        const deferred = q.defer();

        if (queryObject.entity) {
            this.getEntity(queryObject.entity).then(result => {
                deferred.resolve(result);
            });
        }
        else {
            deferred.reject('not found');
        }

        return deferred.promise;
    }
}

module.exports = FileDb;
