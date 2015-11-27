'use strict';

jest.dontMock('../../lib/entity');
jest.dontMock('../../lib/pipeline-steps/entity-extractor');

const entityExtractor = require('../../lib/pipeline-steps/entity-extractor'),
    Entity = require('../../lib/entity');

describe('EntityExtractor', () => {
    it('extract entity from url', () => {
        let entity;

        function check(name, id, body, child) {
            expect(entity.name).toBe(name);
            expect(entity.id).toBe(id);
            expect(entity.body).toEqual(body);
            expect(entity.child).toEqual(child);
        }

        entity = entityExtractor.extract('orders', null);
        check('orders', null, null, null);

        entity = entityExtractor.extract('orders/1', null);
        check('orders', '1', null, null);

        entity = entityExtractor.extract('orders/1', {some: 'body'});
        check('orders', '1', {some: 'body'}, null);

        entity = entityExtractor.extract('orders/1/invoices', null);
        check('orders', '1', null, new Entity({
            name: 'invoices'
        }));

        entity = entityExtractor.extract('orders/1/invoices', {some: 'body'});
        check('orders', '1', null, new Entity({
            name: 'invoices',
            body: [{some: 'body'}]
        }));

        entity = entityExtractor.extract('orders/1/invoices/2', {some: 'body'});
        check('orders', '1', null, new Entity({
            name: 'invoices',
            id: '2',
            body: {some: 'body'}
        }));

        entity = entityExtractor.extract('orders/1/invoices/2/payments/credit', null);
        check('orders', '1', null, new Entity({
            name: 'invoices',
            id: '2',
            child: new Entity({
                name: 'payments',
                id: 'credit'
            })
        }));
    });
});