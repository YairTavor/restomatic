'use strict';

const collectionSymbol = Symbol('collection');

/**
 * A collection of parsers that converts from and to different object formats, for example JSON, XML, CSV, etc'.
 *
 *      parsers.register({
 *          ext: 'xml',
 *          mime: ['text/xml'],
 *          serialize: function objectToString(obj){
 *              return ''; // this should convert a JavaScript object to xml string
 *          },
 *          deserialize: function stringToXml(string){
 *              return {}; // this should convert xml string to JavaScript object
 *          }
 *      });
 *
 * @class Parsers
 */
class Parsers {
    constructor() {
        this[collectionSymbol] = [];
    }

    /**
     * Make sure a registered parser has all the properties in order.
     * @param {object} parser - the parser to register.
     * @returns {boolean} true if the parser is valid.
     * @throws if the parser is not valid.
     */
    validateParser(parser) {
        if (!parser.ext) {
            throw new Error('parser must have a non-empty "ext" property');
        }
        else if (!parser.mime) {
            throw new Error('parser must have a non-empty "mime" property');
        }
        else if (typeof parser.serialize !== 'function') {
            throw new Error('parser must have a "serialize" function');
        }
        else if (typeof parser.deserialize !== 'function') {
            throw new Error('parser must have a "deserialize" function');
        }
        return true;
    }

    /**
     * Add a parser to the Parsers collection.
     * @param {object} parser - the parser you with to add.
     */
    register(parser) {
        if (this.validateParser(parser)) {
            this[collectionSymbol].push(parser);
        }
    }

    /**
     * Look for a parser by extension or mime type.
     * @param {string} searchTerm - the name or one of the mime types this parser should handle.
     * @returns {object || null} parser that was found, or null.
     */
    search(searchTerm) {
        let foundParser = null;
        this[collectionSymbol].some(parser => {
            if (parser.ext === searchTerm || parser.mime === searchTerm) {
                foundParser = parser;
            }
            return !!foundParser;
        });
        return foundParser;
    }
}

module.exports = new Parsers();