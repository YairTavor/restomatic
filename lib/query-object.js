'use strict';

const
    Entity = require('./entity'),
    ACTION_GET = 'get',
    ACTION_CREATE = 'create',
    ACTION_UPDATE = 'update',
    ACTION_DELETE = 'delete',
    ACTION_PARTIAL_UPDATE = 'patch';

function checkType(value, type, name, allowNullAndUndefined) {
    const actualType = typeof value;

    if (allowNullAndUndefined && type !== actualType && actualType !== 'undefined' && value !== null) {
        throw new Error(`QueryObject.${name} must be a ${type}, null or undefined. It is of type "${actualType}"`);
    }
    else if (!allowNullAndUndefined && type !== actualType) {
        throw new Error(`QueryObject.${name} must be a ${type}. It is of type "${actualType}"`);
    }

    return true;
}

function checkActionType(actionType) {
    const error = new Error(`QueryObject.action must have value of "${ACTION_GET}",` +
        `"${ACTION_CREATE}", "${ACTION_UPDATE}", "${ACTION_PARTIAL_UPDATE}" or "${ACTION_DELETE}"`);

    let actionTypeNormalized;

    if (!actionType) {
        throw error;
    }

    actionTypeNormalized = actionType.toLowerCase().trim();
    if (actionTypeNormalized !== ACTION_GET &&
        actionTypeNormalized !== ACTION_CREATE &&
        actionTypeNormalized !== ACTION_UPDATE &&
        actionTypeNormalized !== ACTION_PARTIAL_UPDATE &&
        actionTypeNormalized !== ACTION_DELETE) {
        throw error;
    }
    return true;
}

class QueryObject {
    constructor(options) {
        // Static properties
        QueryObject.ACTION_DEFAULT = ACTION_GET;
        QueryObject.ACTION_GET = ACTION_GET;
        QueryObject.ACTION_CREATE = ACTION_CREATE;
        QueryObject.ACTION_UPDATE = ACTION_UPDATE;
        QueryObject.ACTION_PARTIAL_UPDATE = ACTION_PARTIAL_UPDATE;
        QueryObject.ACTION_DELETE = ACTION_DELETE;

        // Private members
        let action = QueryObject.ACTION_DEFAULT,
            entity = null,
            from = 0,
            count = null,
            sort = null,
            ascending = false,
            filter = null;

        // Public properties
        Object.defineProperties(this, {
            'action': {
                enumerable: true,
                get: () => action,
                set: (value) => {
                    if (checkType(value, 'string', 'action', false) && checkActionType(value)) {
                        action = value;
                    }
                }
            },
            'entity': {
                enumerable: true,
                get: () => entity,
                set: (value) => {
                    if (checkType(value, 'object', 'entity', false)) {
                        if (!value instanceof Entity) {
                            entity = new Entity(value);
                        }
                        else {
                            entity = value;
                        }
                    }
                }
            },
            'from': {
                enumerable: true,
                get: () => from,
                set: (value) => {
                    if (checkType(value, 'number', 'from', false)) {
                        from = value;
                    }
                }
            },
            'count': {
                enumerable: true,
                get: () => count,
                set: (value) => {
                    if (checkType(value, 'number', 'count', true)) {
                        count = value || null;
                    }
                }
            },
            'sort': {
                enumerable: true,
                get: () => sort,
                set: (value) => {
                    if (checkType(value, 'string', 'sort', true)) {
                        sort = value || null;
                    }
                }
            },
            'ascending': {
                enumerable: true,
                get: () => ascending,
                set: (value) => {
                    if (checkType(value, 'boolean', 'ascending', true)) {
                        ascending = value || true;
                    }
                }
            },
            'filter' : {
                enumerable: true,
                get: () => filter,
                set: (value) => {
                    if (checkType(value, 'object', 'filter', true)) {
                        ascending = value || null;
                    }
                }
            }
        });

        if (options) {
            Object.assign(this, options);
        }
    }
}

module.exports = QueryObject;