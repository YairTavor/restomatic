(function(){
    'use strict';
    var assert = require('assert'),
        DbAdapter = require('../lib/db-adapter.js'),
        dbAdapter = new DbAdapter();

    describe('DbAdapter', function(){
        it('has init function', function(){
            assert(dbAdapter.init);
            assert.throws(function(){dbAdapter.init();});
        });

        it('has query function', function(){
            assert(dbAdapter.query);
            assert.throws(function(){dbAdapter.query()});
        });
    });
}());
