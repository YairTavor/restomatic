'use strict';

/**
 * Get the command line arguments of your node app in an object.
 * In your node app:
 *
 *      var commandLineArguments = require('./command-line-args.js'),
 *          args = commandLineArguments.get();
 *
 * args will be an object holding the command line arguments used during the application running.
 *
 * @class CommandLineArgs
 */
class CommandLineArgs {

    /**
     * Convert command line arguments to object.
     * Support for arguments without values (these will get a boolean true value automatically) or
     * Key=Value pair.
     *
     * For example, when you run your node app like this
     *
     *      node [application name] -keyA -keyB=valueB
     *
     * Calling the "get" function will return
     *
     *      { keyA: true, keyB: "valueB" }
     *
     * @method get
     * @returns {object} containing the  the key-value pairs
     */
    get() {
        const result = {};

        process.argv.forEach((arg, index) => {
            let value,
                keyValue;

            if (index > 1) {
                keyValue = arg.split('=', 2);
                if (keyValue.length === 1) {
                    result[keyValue[0].trim()] = true;
                }
                else {
                    value = keyValue[1].trim();
                    if (value.toLocaleLowerCase() === 'true') {
                        value = true;
                    }
                    else if (value.toLocaleLowerCase() === 'false') {
                        value = false;
                    }
                    result[keyValue[0].trim()] = value;
                }
            }
        });

        return result;
    }
}

module.exports = new CommandLineArgs();