'use strict';

/**
 * Wrap the console logger and allow to log debug messages when its in debug mode.
 * @class logger
 */
const logger = {
    isDebugMode: false,
    debug: function debug(message) {
        if (this.isDebugMode) {
            /* eslint-disable no-console */
            console.log(message);
            /* eslint-enable no-console */
        }
    }
};

Object.assign(logger, console);
module.exports = logger;
