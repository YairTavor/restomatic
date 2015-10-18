(function(){
    'use strict';
    var q = require('q'),
        logger = require('./logger.js');

    module.exports = {
        process : function(args){
            var deffered = q.defer();

            logger.debug('header parser start');

            // TODO: parse the request format from the url or request headers
            args.data.requestFormat = 'json';

            deffered.resolve(args);
            logger.debug('header parser end');

            return deffered.promise;
        }
    }
}());
