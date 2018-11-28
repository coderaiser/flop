'use strict';

const path = require('path');

const test = require('tape');
const mkdirp = require('mkdirp');
const stub = require('@cloudcmd/stub');
const mockRequire = require('mock-require');
const {reRequire} = mockRequire;

const flop = require('..');

const fixture = path.join(__dirname, 'fixture');
const empty = path.join(fixture, 'empty');
mkdirp.sync(empty);

test('flop: read: size', (t) => {
    flop.read(empty, 'size', (e, size) => {
        t.equal(size, '0b', 'should size to be equal');
        t.end();
    });
});

test('flop: read: size raw', (t) => {
    flop.read(empty, 'size raw', (e, size) => {
        t.equal(size, 0, 'should size to be equal');
        t.end();
    });
});

test('flop: read: time', (t) => {
    flop.read(empty, 'time', (e, time) => {
        t.ok(time instanceof Date, 'should retun date');
        t.end();
    });
});

test('flop: read: time raw', (t) => {
    flop.read(empty, 'time raw', (e, time) => {
        t.notOk(Number.isNaN(time), 'should retun number');
        t.end();
    });
});

test('flop: read: raw', (t) => {
    flop.read(empty, 'raw', (e, result) => {
        const expect = {
            path: empty + path.sep,
            files: []
        };
        t.deepEqual(result, expect, 'should return result');
        t.end();
    });
});

test('flop: read', (t) => {
    flop.read(empty, (e, result) => {
        const expect = {
            path: empty + path.sep,
            files: []
        };
        t.deepEqual(result, expect, 'should return result');
        t.end();
    });
});

test('flop: read: options', (t) => {
    const readify = stub()
        .returns(Promise.resolve());
    
    mockRequire('readify', readify);
    const flop = reRequire('..');
    
    const callback = stub();
    const options = {
        order: 'asc',
        sort: 'name',
    };
    
    flop.read(empty, options, callback);
    
    const expect = [
        empty,
        options,
    ];
    
    t.deepEqual(readify.args.pop(), expect, 'should call with args');
    t.end();
});

