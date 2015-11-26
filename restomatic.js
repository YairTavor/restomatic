'use strict';
const http = require('http'),
    FileDb = require('./lib/file-db.js'),
    DbAdapter = require('./lib/db-adapter.js'),
    Pipeline = require('./lib/pipeline.js'),
    parsers = require('./lib/parsers'),
    jsonParser = require('./lib/parsers/json-parser'),
    commandLineArgs = require('./lib/command-line-args.js').get(),
    logger = require('./lib/logger.js'),
    db = new FileDb('./temporary-db');

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
        if(commandLineArgs['-h'] || commandLineArgs['-help']){
            this.help();
        }
        else {
            db.init().then((connection) => {
                logger.isDebugMode = !!commandLineArgs['-d'];

                http.createServer((req, res) => {
                    // TODO: skip query for cross domain pre-flight requests with OPTIONS header. should just return 200 OK.
                    // TODO: check for static file handling before going into the pipeline
                    this.pipeline.start(db, req, res);
                }).listen(this.port, this.ip);

                // this.consoleTesting();

                logger.log('restomatic server running at http://' + this.ip + ':' + this.port + '/');
            }, (err) => {
                logger.log(err);
            });
        }
    }

    // todo: implement command line testing
    consoleTesting() {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', function (text) {
            console.log(text);
            if (text.trim() === 'quit') {
                done();
            }
        });

        function done() {
            console.log('Now that process.stdin is paused, there is nothing more to do.');
            process.exit();
        }
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
    FileDb: FileDb,
    DbAdapter: DbAdapter,
    server: new Restomatic()
};
