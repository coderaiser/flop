'use strict';

const path = require('path');

const test = require('supertape');
const mkdirp = require('mkdirp');
const stub = require('@cloudcmd/stub');
const mockRequire = require('mock-require');
const {reRequire} = mockRequire;

const flop = require('..');

const fixture = path.join(__dirname, 'fixture');
const empty = path.join(fixture, 'empty');
mkdirp.sync(empty);

test('flop: read: size', async (t) => {
    const size = await flop.read(empty, 'size');
    
    t.equal(size, '0b', 'should size to be equal');
    t.end();
});

test('flop: read: size raw', async (t) => {
    const size = await flop.read(empty, 'size raw');
    
    t.equal(size, 0, 'should size to be equal');
    t.end();
});

test('flop: read: time', async (t) => {
    const time = await flop.read(empty, 'time');
    
    t.ok(time instanceof Date, 'should retun date');
    t.end();
});

test('flop: read: time raw', async (t) => {
    const time = await flop.read(empty, 'time raw');
    t.notOk(Number.isNaN(time), 'should retun number');
    t.end();
});

test('flop: read: raw', async (t) => {
    const result = await flop.read(empty, 'raw');
    const expect = {
        path: empty + path.sep,
        files: [],
    };
    
    t.deepEqual(result, expect, 'should return result');
    t.end();
});

test('flop: read', async (t) => {
    const result = await flop.read(empty);
    const expect = {
        path: empty + path.sep,
        files: [],
    };
    
    t.deepEqual(result, expect, 'should return result');
    t.end();
});

test('flop: read: options', async (t) => {
    const readify = stub()
        .returns(Promise.resolve());
    
    mockRequire('readify', readify);
    const flop = reRequire('..');
    
    const options = {
        order: 'asc',
        sort: 'name',
    };
    
    await flop.read(empty, options);
    
    const expect = [
        empty,
        options,
    ];
    
    t.deepEqual(readify.args.pop(), expect, 'should call with args');
    t.end();
});

