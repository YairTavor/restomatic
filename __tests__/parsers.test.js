'use strict';

jest.dontMock('../lib/parsers.js');

const parsers = require('../lib/parsers.js');

describe('parsers', () => {
    it('validates that a parser has all required properties', () => {
        const missingExtension = {},
            missingMime = {
                ext: 'xml'
            },
            missingSerialize = {
                ext: 'xml',
                mime: 'application/xml'
            },
            missingDeserialize = {
                ext: 'xml',
                mime: 'application/xml',
                serialize: () => {
                    return '';
                }
            },
            validParser = {
                ext: 'xml',
                mime: 'application/xml',
                serialize: () => {
                    return '';
                },
                deserialize: () => {
                    return {};
                }
            };

        expect(() => { parsers.validateParser(missingExtension); }).toThrow();
        expect(() => { parsers.validateParser(missingMime); }).toThrow();
        expect(() => { parsers.validateParser(missingSerialize); }).toThrow();
        expect(() => { parsers.validateParser(missingDeserialize); }).toThrow();
        expect(parsers.validateParser(validParser)).toBe(true);
    });

    it('can register a new parser', () => {
        const parser = {
            ext: 'xml',
            mime: 'application/xml',
            serialize: () => {
                return '';
            },
            deserialize: () => {
                return {};
            }
        };

        parsers.register(parser);

        expect(parsers.search('xml')).toBe(parser);
    });
});