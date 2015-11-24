'use strict';

jest.dontMock('../../lib/parsers/json-parser.js');

const jsonParser = require('../../lib/parsers/json-parser.js');

describe('json-parser', () => {
   it('serialize json', () => {
       const obj = { name: 'x', age: 20 },
           json = '{"name":"x","age":20}';

       expect(jsonParser.serialize(obj)).toBe(json);
   });

    it('deserialize json', () => {
        const obj = { name: 'x', age: 20 },
            json = '{"name":"x","age":20}';

        expect(jsonParser.deserialize(json)).toEqual(obj);
    });
});
