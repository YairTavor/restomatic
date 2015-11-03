(function(){
    'use strict';
    var q = require('q'),
        logger = require('./logger.js');

    module.exports = {
        process : function(args){
            var deferred = q.defer();

            logger.debug('body parser start');

            //TODO: use plugin to parse body from fromats to json
            deferred.resolve(args);
            logger.debug('body parser end');

            return deferred.promise;
        }
    };
}());