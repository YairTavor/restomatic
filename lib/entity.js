'use strict';

/**
 * Represents the entity you with to perform CRUD operation on.
 * @class Entity
 */
class Entity {
    constructor(rawEntity) {
        /**
         * The name of the entity, usually correspond with a document in the DB
         * @property name
         * @type {string}
         * @default empty string
         */
        this.name = '';

        /**
         * The id of the entity in the DB
         * @property id
         * @type {*}
         * @default null
         */
        this.id = null;

        /**
         * The content of the entity. This is the actual data to get from or push to the DB
         * @property body
         * @type {*}
         * @default null
         */
        this.body = null;

        /**
         * If the request is to update or get a child of the entity, this is where you define it
         * @property child
         * @type {Entity || null}
         * @default null
         */
        this.child = null;

        if (rawEntity) {
            Object.assign(this, rawEntity);
        }
    }

    /**
     * Make sure the entity is properly defined and has no conflicting instructions
     * @method validate
     * @returns {boolean}
     */
    validate() {
        if (!this.name) {
            throw new Error('Entity name can not be empty');
        }

        if (!this.id && this.body && !Array.isArray(this.body)) {
            throw new Error('When doing mass update or create, entity body must be an array');
        }

        if (this.child && !this.id) {
            throw new Error('Can not get or set a child of a collection. Entity with child must also specify an id');
        }

        if (this.child && this.body) {
            throw new Error('When getting or setting child entity, the body must be on the child and not the parent.');
        }

        if (this.child && this.child instanceof Entity === false ) {
            throw new Error('A child of an entity must also be an Entity.');
        }

        return true;
    }

    /**
     * Check if the entity represent a collection of entities or a single entity
     * @method isCollection
     * @returns {boolean}
     */
    isCollection() {
        return Array.isArray(this.body);
    }

    /**
     * Check if the entity has a child defined
     * @method hadChild
     * @returns {boolean}
     */
    hasChild() {
        return !!this.child;
    }

}

module.exports = Entity;