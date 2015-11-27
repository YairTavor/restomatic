'use strict';

jest.dontMock('../lib/entity.js');

const Entity = require('../lib/entity.js');

describe('entity', () => {
    it('can create empty entity', () => {
        const entity = new Entity();

        expect(entity).not.toBeUndefined();
    });

    it('can pass object to fill out entity', () => {
        const entity = new Entity({name: 'someName'});

        expect(entity.name).toBe('someName');
    });

    it('tells if entity body is a collection', () => {
        const entity = new Entity();

        entity.body = [];
        expect(entity.isCollection()).toBe(true);

        entity.body = {};
        expect(entity.isCollection()).toBe(false);

        entity.body = null;
        expect(entity.isCollection()).toBe(false);
    });

    it('tells if entity has a child', () => {
        const entity = new Entity();

        entity.child = null;
        expect(entity.hasChild()).toBe(false);

        entity.child = new Entity();
        expect(entity.hasChild()).toBe(true);
    });

    it('validates the entity properly', () => {
        const entity = new Entity();

        // ---- invalid cases --- //
        entity.name = '';
        expect(() => { entity.validate(); }).toThrow();

        entity.name = 'orders';
        entity.body = {}; // must be an array for mass update or delete
        expect(() => { entity.validate(); }).toThrow();

        entity.body = null;
        entity.id = null;
        entity.child = new Entity(); // can not have a child without having id on the parent
        expect(() => { entity.validate(); }).toThrow();

        entity.id = 5;
        entity.child = {}; // wrong type, child should be Entity
        expect(() => { entity.validate(); }).toThrow();

        entity.body = [];
        // can not have child AND body, for update or create body must be inside the child not the parent
        entity.child = new Entity();
        expect(() => { entity.validate(); }).toThrow();

        // ---- valid cases ----- //

        entity.name = 'orders';
        entity.id = null;
        entity.body = null;
        entity.child = null;
        expect(() => { entity.validate(); }).not.toThrow();

        entity.id = 5;
        expect(() => { entity.validate(); }).not.toThrow();

        entity.body = {};
        expect(() => { entity.validate(); }).not.toThrow();

        entity.body = null;
        entity.child = new Entity();
        expect(() => { entity.validate(); }).not.toThrow();

        entity.id = null;
        entity.body = [];
        entity.child = null;
        expect(() => { entity.validate(); }).not.toThrow();
    });
});