(function(){
    'use strict';

    var assert = require('assert'),
        fs = require('fs'),
        FileDb = require('../lib/file-db.js'),

        mockFunctionFactory = function(name, error, success){
            error = (typeof error !== 'undefined') ? error : callbackError;
            success = (typeof success !== 'undefined') ? success : callbackSuccess;

            return function() {
                lastMethod = name;

                // set the last path being called by one of the fs functions
                lastPath = arguments[0];

                // invoke the callback function
                arguments[arguments.length - 1](error, success);
            };
        },

        original = {
            read:   fs.readFile,
            write:  fs.writeFile,
            exists: fs.exists,
            mkdir:  fs.mkdir
        },

        mock = {
            read:   mockFunctionFactory('read'),
            write:  mockFunctionFactory('write'),
            exists: mockFunctionFactory('exists', null, true),
            mkdir:  mockFunctionFactory('mkdir')
        },

        callbackError,
        callbackSuccess,
        lastPath,
        lastMethod;

    describe('file-db', function(){

        beforeEach(function(){
            //mock fs
            fs.readFile  = mock.read;
            fs.writeFile = mock.write;
            fs.exists    = mock.exists;
            fs.mkdir     = mock.mkdir;

            //reset values
            callbackError = null;
            callbackSuccess = true;
            lastPath = '';
        });

        afterEach(function(){
            // unmock fs
            fs.readFile  = original.read;
            fs.writeFile = original.write;
            fs.exists    = original.exists;
            fs.mkdir     = original.mkdir;
        });

        it('Create a fileDb instance', function(){
            var fileDb = new FileDb('baseFolder');

            assert.equal(fileDb.dbFolder, 'baseFolder');
        });

        it('Create the db folder if not exists when initialized', function(){
            var fileDb = new FileDb('baseFolder');

            fs.exists = mockFunctionFactory('exists', null, false);
            return fileDb.init().then(function(){
                assert.equal(lastMethod, 'mkdir');
                assert.equal(lastPath, 'baseFolder');
            });

        });

        it('Get file path by entity', function(){
            var fileDb = new FileDb('baseFolder'),
                result;

            result = fileDb.getPath('persons');
            assert.equal(result, 'baseFolder/persons.db');

            //works when unnecessary slashes are added
            fileDb.dbFolder = 'baseFolder/';
            result = fileDb.getPath('/persons');
            assert.equal(result, 'baseFolder/persons.db');
        });

        it('Save data to db', function(){
            var fileDb = new FileDb('baseFolder');

            return fileDb.persistDb('persons', [{name:'Albert'}]).then(function(result){
                assert.equal(lastMethod, 'write');
                assert.equal(lastPath, 'baseFolder/persons.db');
            });
        });

        it('Read data from db when db does not exists', function(){
            var fileDb = new FileDb('baseFolder');

            fs.exists = mockFunctionFactory('exists', null, false);
            return fileDb.getDb('persons').then(function(result){
                // create the db
                assert.equal(lastMethod, 'write');
                assert.equal(lastPath, 'baseFolder/persons.db');

                // return empty array
                assert.deepEqual(result, []);
            });
        });

        it('Read data from db when db exists', function(){
            var fileDb = new FileDb('baseFolder');

            fs.exists = mockFunctionFactory('exists', null, true);
            fs.readFile = mockFunctionFactory('read', null, '[{"name":"Albert"}]');

            return fileDb.getDb('persons').then(function(result){
                // read the db
                assert.equal(lastMethod, 'read');
                assert.equal(lastPath, 'baseFolder/persons.db');

                // return array of objects
                assert.deepEqual(result, [{name:'Albert'}]);
            });
        });

        // TODO: test query function
    });
}());
