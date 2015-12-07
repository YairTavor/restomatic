'use strict';

const Entity = require('./../entity');

class EntityExtractor {
    /**
     * Get an entity construct out of the url path
     * @param {string} path - url path
     * @param {object} [requestBody] - the body of the request, or null
     * @returns {Entity} the entity that needs to be retrieved from storage
     */
    extract(path, requestBody) {
        const entity = new Entity;
        let pathItems;

        pathItems = path.split('/').filter(item => !!item);

        if (pathItems.length > 0) {
            entity.name = pathItems[0];
            if (pathItems.length > 1) {
                entity.id = pathItems[1];
            }

            if (pathItems.length > 2) {
                pathItems.splice(0, 2);
                entity.child = this.extract(pathItems.join('/'), requestBody);
            }
            else {
                this.setEntityBody(entity, requestBody);
            }
        }
        return entity;
    }

    /**
     * Set the body of an entity according to the entity state
     * @param {Entity} entity - where the body belongs
     * @param {object} body - the body to set
     */
    setEntityBody(entity, body) {
        if (body && !entity.child) {
            entity.body = body;
            if (!entity.id && !Array.isArray(body)) {
                entity.body = [body];
            }
        }
    }
}


module.exports = new EntityExtractor();