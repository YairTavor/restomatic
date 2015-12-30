'use strict';
const http = require('http'),
    Pipeline = require('./lib/pipeline'),
    parsers = require('./lib/parsers'),
    jsonParser = require('./lib/parsers/json-parser'),
    commandLineArgs = require('./lib/command-line-args').get(),
    logger = require('./lib/logger'),
    bodyReader = require('./lib/body-reader'),
    db = null;

class Restomatic {
    constructor() {
        /**
         * The IP address of your server.
         *
         * @property ip
         * @type {string}
         * @default '127.0.0.1'
         */
        this.ip = commandLineArgs['-i'] || '127.0.0.1';

        /**
         * The port number of your server
         *
         * @property port
         * @type {number}
         * @default 1337
         */
        this.port = commandLineArgs['-p'] || 1337;

        /**
         * This is an instance of the restomatic DbAdapter. By default, this uses a file db.
         * You may override this with a different adapter implementation.
         *
         * @property db
         * @type {object}
         * @default restomatic.FileDb
         */
        this.db = db;

        /**
         * //TODO: Document pipeline
         *
         * @property pipeline
         * @type {object}
         */
        this.pipeline = new Pipeline();

        /**
         * Register parsers that can convert different formats to JavaScript objects.
         * @property parsers
         * @type {object}
         */
        this.parsers = parsers;

        this.parsers.register(jsonParser);
    }
    /**
     * Start the restomatic server. If you wish to configure a different ip address, port, db adapter or whatever -
     * call these function or set these properties before calling "start".
     *
     * @method start
     */
    start() {
        if (commandLineArgs['-h'] || commandLineArgs['-help']) {
            this.help();
        }
        else if ( this.db === null ){
            throw new Error('No db adapter was initialized. Please set restomatic.server.db before calling ' +
                'the start() function');
        }
        else {
            logger.isDebugMode = !!commandLineArgs['-d'];

            http.createServer((req, res) => {
                // TODO: skip query for cross domain pre-flight requests with OPTIONS header. should just return 200 OK.
                // TODO: check for static file handling before going into the pipeline
                if(bodyReader.shouldCheckBody(req)){
                    bodyReader.getBody(req, res).then((body) => {
                        req.body = body;
                        this.pipeline.start(this.db, req, res);
                    });
                }
                else {
                    req.body = null;
                    this.pipeline.start(this.db, req, res);
                }
            }).listen(this.port, this.ip);

            // this.consoleTesting();

            logger.log('restomatic server running at http://' + this.ip + ':' + this.port + '/');
        }
    }

    // TODO: implement command line testing
    consoleTesting() {
        function done() {
            console.log('Now that process.stdin is paused, there is nothing more to do.');
            process.exit();
        }

        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', function handleInput(text) {
            logger.log(text);
            if (text.trim() === 'quit') {
                done();
            }
        });
    }

    help() {
        logger.log('---=== Restomatic Commandline Help ===---');
        logger.log(' ');
        logger.log('Here are the possible command arguments for Restomatic:');
        logger.log(' ');
        logger.log('    -p=1337       set port number');
        logger.log('    -i=127.0.0.1  set ip address');
        logger.log('    -d            debug mode - make Restomatic more chatty');
        logger.log('    -h or -help   this help');
        logger.log(' ');
        logger.log('For more information, go to https://github.com/yairtavor/restomatic');
    }
}

module.exports = {
    server: new Restomatic()
};
