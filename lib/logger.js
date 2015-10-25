(function(){
    'use strict';

    var Logger = function(){
        this.isDebugMode = false;
        this.debug = function(message){
            if(this.isDebugMode){
                /*eslint-disable no-console */
                console.log(message);
                /*eslint-enable no-console */
            }
        }.bind(this);
    };

    Logger.prototype = console;

    module.exports = new Logger();
}());