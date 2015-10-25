(function(){
    'use strict';
    var q = require('q'),
        logger = require('./logger.js');

    module.exports = {
        process : function(args){
            var deferred = q.defer();

            logger.debug('body parser start');

            //TODO: handle file upload and other stuff here
            deferred.resolve(args);
            logger.debug('body parser end');

            return deferred.promise;
        }
    };
}());