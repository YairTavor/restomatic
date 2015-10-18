(function(){
    'use strict';

    var Logger = function(){
        this.isDebugMode = false;
        this.debug = function(message){
            if(this.isDebugMode){
                console.log(message);
            }
        }.bind(this);
    };

    Logger.prototype = console;

    module.exports = new Logger();
}());