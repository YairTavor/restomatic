(function(){
    'use strict';
    var q = require('q'),
        logger = require('./logger.js');

    module.exports = {
        process : function(args){
            var deffered = q.defer();

            logger.debug('request handler start');
            //TODO: fill the query object here
            deffered.resolve(args);
            logger.debug('request handler end');

            return deffered.promise;
        }
    }
}());