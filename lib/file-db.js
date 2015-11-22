'use strict';

const DbAdapter = require('./db-adapter.js'),
    fs = require('fs'),
    path = require('path'),
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
        return path.join(this.dbFolder, entity + '.db');
    }

    /**
     * Save the json object to a file
     *
     * @method persistDb
     * @param {string} entity - the name of the entity collection
     * @param {Array} content - the array that contains all the documents of this entity
     * @returns {Promise}
     */
    persistDb(entity, content) {
        const filePath = this.getPath(entity),
            stringContent = JSON.stringify(content);

        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, stringContent, this.fileEncoding, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
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
        const filePath = this.getPath(entity);


        return new Promise((resolve, reject) => {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    // Generate the file if it doesn't exist
                    this.persistDb(entity, []).then(() => {
                        resolve([]); // new empty collection
                    });
                }
                else {
                    // Read file content and return it as an object
                    fs.readFile(filePath, this.fileEncoding, (err, content) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(JSON.parse(content));
                        }
                    });
                }
            });
        });
    }

    // see documentation inside db-adapter.js
    init() {
        /*
         * when you create your own adapter, this is where you open a connection to the db.
         * this is a file db, where each entity has it's own file, so no point opening a connection.
         * we make sure the folder exists and create it if not.
         */
        return new Promise((resolve, reject) => {
            fs.exists(this.dbFolder, (exists) => {
                if (!exists) {
                    fs.mkdir(this.dbFolder, (err) => {
                        if (err) {
                            reject();
                        }
                        else {
                            resolve();
                        }
                    });
                }
                else {
                    resolve();
                }
            });
        });
    }

    // see documentation inside db-adapter.js
    query(queryObject) {
        if (queryObject.entity) {
            this.getDb(queryObject.entity).then((collection) => {
                logger.debug(JSON.stringify(collection));
            });
        }
    }
}

module.exports = FileDb;
