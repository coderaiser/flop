'use strict';

const {EventEmitter} = require('events');
const path = require('path');
const {mkdirSync} = require('fs');

const wait = require('@iocmd/wait');
const {test, stub} = require('supertape');

const tryToCatch = require('try-to-catch');
const mockRequire = require('mock-require');

const flop = require('..');

const {reRequire, stopAll} = mockRequire;

const fixture = path.join(__dirname, 'fixture');
const empty = path.join(fixture, 'empty');

mkdirSync(empty, {
    recursive: true,
});

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

test('flop: read: raw', async (t) => {
    const result = await flop.read(empty, 'raw');
    const expected = empty;
    
    t.equal(result.path, expected, 'should return result');
    t.end();
});

test('flop: read', async (t) => {
    const result = await flop.read(empty);
    
    t.equal(result.path, empty, 'should return result');
    t.end();
});

test('flop: read: options', async (t) => {
    const read = stub().resolves();
    
    mockRequire('win32', {
        read,
    });
    const flop = reRequire('..');
    
    const options = {
        order: 'asc',
        sort: 'name',
    };
    
    await flop.read(empty, options);
    
    const expect = [empty, options];
    
    stopAll();
    
    t.deepEqual(read.args.pop(), expect, 'should call with args');
    t.end();
});

test('flop: remove: called: end', async (t) => {
    const emitter = new EventEmitter();
    const remy = stub().returns(emitter);
    
    const path = '/';
    const files = [];
    
    mockRequire('remy', remy);
    const {remove} = reRequire('..');
    
    const emit = emitter.emit.bind(emitter);
    
    await Promise.all([
        remove(path, files),
        wait(emit, 'end'),
    ]);
    
    stopAll();
    
    t.calledWith(remy, [path, files], 'should call remy');
    t.end();
});

test('flop: remove: called: error', async (t) => {
    const emitter = new EventEmitter();
    const remy = stub().returns(emitter);
    
    const path = '/';
    const files = [];
    
    mockRequire('remy', remy);
    const {remove} = reRequire('..');
    
    const emit = emitter.emit.bind(emitter);
    const all = Promise.all.bind(Promise);
    
    const [e] = await tryToCatch(all, [
        wait(0, emit, 'error', Error('hello')),
        remove(path, files),
    ]);
    
    stopAll();
    
    t.equal(e.message, 'hello');
    t.end();
});

test('flop: remove: called', async (t) => {
    const path = '/';
    const files = ['not-found'];
    
    const {remove} = reRequire('..');
    const [error] = await tryToCatch(remove, path, files);
    
    t.equal(error.code, 'ENOENT');
    t.end();
});
