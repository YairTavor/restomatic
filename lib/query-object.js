(function () {
    'use strict';

    var ACTION_GET = 'get',
        ACTION_CREATE = 'create',
        ACTION_UPDATE = 'update',
        ACTION_DELETE = 'delete';

    function QueryObject(options) {
        var action = QueryObject.ACTION_DEFAULT,
            entity = null,
            id = null,
            from = 0,
            count = null,
            sort = null,
            ascending = false;


        function mergeOptions(source, target) {
            var property;

            for (property in source) {
                if(source.hasOwnProperty(property)) {
                    target[property] = source[property];
                }
            }
        }

        function checkType(value, type, name, allowNullAndUndefined) {
            var actualType = typeof value;

            if (allowNullAndUndefined && type !== actualType && 'undefined' !== actualType && value !== null) {
                throw new Error('QueryObject.' + name + ' must be a ' + type + ', null or undefined. It is of type "' + (actualType) + '"');
            }
            else if (!allowNullAndUndefined && type !== actualType) {
                throw new Error('QueryObject.' + name + ' must be a ' + type + '. It is of type "' + (actualType) + '"');
            }

            return true;
        }

        function checkActionType(actionType) {
            var error = new Error('QueryObject.action must have value of "' + ACTION_GET + '", "' + ACTION_CREATE + '", "' + ACTION_UPDATE + '" or "' + ACTION_DELETE + '"');
            if (!actionType) {
                throw error;
            }

            actionType = actionType.toLowerCase().trim();
            if (actionType !== ACTION_GET &&
                actionType !== ACTION_CREATE &&
                actionType !== ACTION_UPDATE &&
                actionType !== ACTION_DELETE) {
                throw error;
            }
            return true;
        }

        Object.defineProperty(this, 'action', {
            enumerable: true,
            get: function () {
                return action;
            },
            set: function (value) {
                if (checkType(value, 'string', 'action', false) && checkActionType(value)) {
                    action = value;
                }
            }
        });

        Object.defineProperty(this, 'entity', {
            enumerable: true,
            get: function () {
                return entity;
            },
            set: function (value) {
                if (checkType(value, 'string', 'entity', true)) {
                    entity = value || null;
                }
            }
        });

        Object.defineProperty(this, 'id', {
            enumerable: true,
            get: function () {
                return id;
            },
            set: function (value) {
                if (checkType(value, 'string', 'id', true)) {
                    id = value || null;
                }
            }
        });

        Object.defineProperty(this, 'from', {
            enumerable: true,
            get: function () {
                return from;
            },
            set: function (value) {
                if (checkType(value, 'number', 'from', false)) {
                    from = value;
                }
            }
        });

        Object.defineProperty(this, 'count', {
            enumerable: true,
            get: function () {
                return count;
            },
            set: function (value) {
                if (checkType(value, 'number', 'count', true)) {
                    count = value || null;
                }
            }
        });

        Object.defineProperty(this, 'sort', {
            enumerable: true,
            get: function () {
                return sort;
            },
            set: function (value) {
                if (checkType(value, 'string', 'sort', true)) {
                    sort = value || null;
                }
            }
        });

        Object.defineProperty(this, 'ascending', {
            enumerable: true,
            get: function () {
                return ascending;
            },
            set: function (value) {
                if (checkType(value, 'boolean', 'ascending', true)) {
                    ascending = value || true;
                }
            }
        });


        if (options) {
            mergeOptions(options, this);
        }
    }

    // Static properties
    QueryObject.ACTION_DEFAULT = ACTION_GET;
    QueryObject.ACTION_GET = ACTION_GET;
    QueryObject.ACTION_CREATE = ACTION_CREATE;
    QueryObject.ACTION_UPDATE = ACTION_UPDATE;
    QueryObject.ACTION_DELETE = ACTION_DELETE;

    module.exports = QueryObject;
}());
