(function(){
    'use strict';
    var q = require('q'),
        logger = require('./logger.js');

    module.exports = {
        process : function(args){
            var deffered = q.defer();

            logger.debug('body parser start');

            //TODO: handle file upload and other stuff here
            deffered.resolve(args);
            logger.debug('body parser end');

            return deffered.promise;
        }
    }
}());