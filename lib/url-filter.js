(function(){
    'use strict';
    var q = require('q'),
        logger = require('./logger.js');

    module.exports = {
        process : function(args){
            var deferred = q.defer();

            logger.debug('request filter start');
            // TODO: allow or block request per url
            deferred.resolve(args);
            logger.debug('request filter end');

            return deferred.promise;
        }
    };
}());