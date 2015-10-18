(function(){
    'use strict';
    
    module.exports = function QueryObject(options){
        var entity = null,
            id = null,
            from = 0,
            count = null,
            sort = null,
            ascending = false;

        function mergeOptions(source, target){
            var property;

            for(property in source){
                target[property] = source[property];
            }
        }

        function checkType(value, type, name, allowNullAndUndefined){
            var actualType = typeof value;

            if(allowNullAndUndefined && type !== actualType && 'undefined' !== actualType && value !== null ){
                throw new Error('QueryObject.' + name + ' must be a ' + type + ', null or undefined. It is of type "' + (actualType) + '"');
            }
            else if(!allowNullAndUndefined && type !== actualType){
                throw new Error('QueryObject.' + name + ' must be a ' + type + '. It is of type "' + (actualType) + '"');
            }

            return true;
        }


        Object.defineProperty(this, 'entity', {
            enumerable : true,
            get : function(){
                return entity;
            },
            set : function(value){
                if(checkType(value, 'string', 'entity', true)){
                    entity = value || null;
                }
            }
        });

        Object.defineProperty(this, 'id', {
            enumerable : true,
            get : function(){
                return id;
            },
            set : function(value){
                if(checkType(value, 'string', 'id', true)){
                    id = value || null;
                }
            }
        });

        Object.defineProperty(this, 'from', {
            enumerable : true,
            get : function(){
                return from;
            },
            set : function(value){
                if(checkType(value, 'number', 'from', false)){
                    from = value;
                }
            }
        });

        Object.defineProperty(this, 'count', {
            enumerable : true,
            get : function(){
                return count;
            },
            set : function(value){
                if(checkType(value, 'number', 'count', true)){
                    count = value || null;
                }
            }
        });

        Object.defineProperty(this, 'sort', {
            enumerable : true,
            get : function(){
                return sort;
            },
            set : function(value){
                if(checkType(value, 'string', 'sort', true)){
                    sort = value || null;
                }
            }
        });

        Object.defineProperty(this, 'ascending', {
            enumerable : true,
            get : function(){
                return ascending;
            },
            set : function(value){
                if(checkType(value, 'boolean', 'ascending', true)){
                    ascending = value || true;
                }
            }
        });


        if(options){
            mergeOptions(options, this);
        }
    };
}());
