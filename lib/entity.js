'use strict';

class Entity {
    constructor(rawEntity) {
        this.name = '';
        this.id = null;
        this.body = null;
        this.child = null;

        if (rawEntity) {
            Object.assign(this, rawEntity);
        }
    }

    validate() {
        if (!this.name) {
            throw new Error('Entity name can not be empty');
        }

        if (!this.id && this.body && !Array.isArray(this.body)) {
            throw new Error('When doing mass update or create, entity body must be an array');
        }

        if (this.child && !this.id) {
            throw new Error('Can not get or set a child of a collection, only for a collection item. Please also specify an id');
        }

        if (this.child && this.body) {
            throw new Error('When getting or setting child entity, the body must be on the child and not the parent.');
        }

        if (this.child && this.child instanceof Entity === false ) {
            throw new Error('A child of an entity must also be an Entity.');
        }

        return true;
    }

    isCollection() {
        return Array.isArray(this.body);
    }

    hasChild() {
        return !!this.child;
    }

}

module.exports = Entity;