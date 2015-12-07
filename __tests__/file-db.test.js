'use strict';

jest.autoMockOff();
jest.setMock('fs', {
    mkdir: jest.genMockFunction().mockImplementation((dirPath, callback) => {
        callback(null);
    }),
    writeFile: jest.genMockFunction().mockImplementation((filePath, content, encoding, callback) => {
        callback(null);
    }),
    readFile: jest.genMockFunction().mockImplementation((filePath, encoding, callback) => {
        callback(null, {});
    }),
    exists: jest.genMockFunction().mockImplementation((filePath, callback) => {
        callback();
    })
});

const FileDb = require('../lib/file-db.js'),
    fs = require('fs');

describe('file-db', () => {
    it('is able to create a FileDb instance', () => {
        const fileDb = new FileDb('baseFolder');
        expect(fileDb.dbFolder).toBe('baseFolder');
    });

    it('is creating the db folder if not exists when initialized', (done) => {
        const fileDb = new FileDb('baseFolder');

        fileDb.init().then(() => {
            expect(fs.mkdir).toBeCalled();
            done();
        });
    });

    it('Get file path by entity', () => {
        const fileDb = new FileDb('baseFolder');
        let result;

        result = fileDb.getPath({ name: 'persons' });
        expect(result).toBe('baseFolder/persons.db');
    });

    it('Save data to db', (done) => {
        const fileDb = new FileDb('baseFolder');

        fileDb.persistDb({ name: 'persons' }, [{name: 'Albert'}]).then(() => {
            // should create 'baseFolder/persons.db'
            expect(fs.writeFile).toBeCalled();
            done();
        });
    });

    it('Read data from db when db does not exists', (done) => {
        const fileDb = new FileDb('baseFolder');

        fileDb.getDb({ name: 'persons' }).then((results) => {
            done();

            // create the db
            expect(fs.writeFile).toBeCalled('baseFolder/persons.db');

            // return empty array
            expect(results).toEqual([]);
        });
    });

    it('Read data from db when db exists', (done) => {
        const fileDb = new FileDb('baseFolder');

        fs.exists.mockImplementation((filePath, callback) => {
            callback(true);
        });
        fs.readFile.mockImplementation((filePath, encoding, callback) => {
            callback(null, '[{"name":"Albert"}]');
        });

        fileDb.getDb('persons').then((results) => {
            // read the db
            expect(fs.readFile).toBeCalled('baseFolder/persons.db');

            // return array of objects
            expect(results).toEqual([{name: 'Albert'}]);
            done();
        });
    });

    // TODO: test query function
});