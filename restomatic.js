(function(){

    var http = require('http'),
        FileDb = require('./lib/file-db.js'),
        DbAdapter = require('./lib/db-adapter.js'),
        pipeline = require('./lib/pipeline.js'),
        commandLineArgs = require('./lib/command-line-args.js'),
        logger = require('./lib/logger.js'),
        db = new FileDb('./tempdb');

    function Restomatic(){
        var self = this;

        /**
         * The IP address of your server.
         *
         * @property ip
         * @type {string}
         * @default '127.0.0.1'
         */
        this.ip = '127.0.0.1';

        /**
         * The port number of your server
         *
         * @property port
         * @type {number}
         * @default 1337
         */
        this.port = 1337;

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
        this.pipeline = pipeline;

        /**
         * Start the restomatic server. If you wish to configure a different ip address, port, db adapter or whatever -
         * call these function or set these properties before calling "start".
         *
         * @method start
         */
        this.start = function(){
            db.init().then(function(connection){
                db.query({
                    entity : 'users'
                });

                logger.isDebugMode = !!commandLineArgs.get().debug;

                http.createServer(function (req, res) {
                    pipeline.start(db, req, res);
                }).listen(self.port, self.ip);
                console.log('restomatic server running at http://'+ self.ip + ':'+ self.port +'/');
            }, function(err){
                console.log(err);
            });
        }
    }

    module.exports = {
        FileDb : FileDb,
        DbAdapter : DbAdapter,
        server : new Restomatic()
    };
}());
