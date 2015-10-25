(function(){
    'use strict';
    var q = require('q'),
        logger = require('./logger.js');

    module.exports = {
        process : function(args){
            var deferred = q.defer();

            logger.debug('header parser start');

            // TODO: parse the request format from the url or request headers
            args.data.requestFormat = 'json';

            deferred.resolve(args);
            logger.debug('header parser end');

            return deferred.promise;
        }
    };
}());
