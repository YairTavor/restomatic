(function(){
    'use strict';
    var q = require('q'),
        logger = require('./logger.js');

    module.exports = {
        process : function(args){
            var deffered = q.defer();

            logger.debug('response handler start');
            //TODO: use the query object to render response
            args.response.writeHead(200, {'Content-Type': 'text/plain'});
            args.data.responseBody = 'Hello World\n';
            deffered.resolve(args);
            logger.debug('response handler end');

            return deffered.promise;
        }
    }
}());