import {EventEmitter} from 'node:events';
import wait from '@iocmd/wait';
import {test, stub} from 'supertape';
import {tryToCatch} from 'try-to-catch';
import * as flop from '../lib/flop.js';

const createError = (code) => Object.assign(Error(code), {
    code,
});

test('flop: create', async (t) => {
    const mkdir = stub().resolves();
    
    await flop.create('/hello', {
        mkdir,
    });
    
    t.calledWith(mkdir, ['/hello', {
        recursive: true,
    }], 'should call mkdir');
    t.end();
});

test('flop: read: size', async (t) => {
    const size = stub().resolves('0b');
    const result = await flop.read('/hello', 'size', {
        size,
    });
    
    t.equal(result, '0b', 'should size to be equal');
    t.end();
});

test('flop: read: size raw', async (t) => {
    const size = stub().resolves(0);
    
    await flop.read('/hello', 'size raw', {
        size,
    });
    
    t.calledWith(size, ['/hello', {
        type: 'raw',
    }], 'should call size with raw type');
    t.end();
});

test('flop: read: raw', async (t) => {
    const readWin32 = stub().resolves();
    
    await flop.read('/hello', 'raw', {
        readWin32,
    });
    
    t.calledWith(readWin32, ['/hello', {
        type: 'raw',
    }], 'should call readWin32 with raw type');
    t.end();
});

test('flop: read', async (t) => {
    const readWin32 = stub().resolves({
        path: '/hello',
    });
    
    const result = await flop.read('/hello', undefined, {
        readWin32,
    });
    
    t.equal(result.path, '/hello', 'should return result');
    t.end();
});

test('flop: read: options', async (t) => {
    const readWin32 = stub().resolves();
    
    const options = {
        order: 'asc',
        sort: 'name',
    };
    
    await flop.read('/hello', options, {
        readWin32,
    });
    
    t.calledWith(readWin32, ['/hello', options], 'should call with args');
    t.end();
});

test('flop: remove: called: end', async (t) => {
    const emitter = new EventEmitter();
    const remy = stub().returns(emitter);
    
    const path = '/';
    const files = [];
    
    const emit = emitter.emit.bind(emitter);
    
    await Promise.all([
        flop.remove(path, files, {
            remy,
        }),
        wait(0, emit, 'end'),
    ]);
    
    t.calledWith(remy, [path, files], 'should call remy');
    t.end();
});

test('flop: remove: called: error', async (t) => {
    const emitter = new EventEmitter();
    const remy = stub().returns(emitter);
    
    const emit = emitter.emit.bind(emitter);
    const all = Promise.all.bind(Promise);
    
    const [e] = await tryToCatch(all, [
        wait(0, emit, 'error', Error('hello')),
        flop.remove('/', [], {
            remy,
        }),
    ]);
    
    t.equal(e.message, 'hello');
    t.end();
});

test('flop: copy', async (t) => {
    const emitter = new EventEmitter();
    const copymitter = stub().returns(emitter);
    
    const emit = emitter.emit.bind(emitter);
    
    await Promise.all([
        flop.copy('/a/name', '/b/name', {
            copymitter,
        }),
        wait(0, emit, 'end', {
            errors: [],
        }),
    ]);
    
    t.calledWith(copymitter, ['/a/', '/b/', ['name']], 'should call copymitter');
    t.end();
});

test('flop: copy: error', async (t) => {
    const emitter = new EventEmitter();
    const copymitter = stub().returns(emitter);
    
    const emit = emitter.emit.bind(emitter);
    const all = Promise.all.bind(Promise);
    
    const [e] = await tryToCatch(all, [
        flop.copy('/a/name', '/b/name', {
            copymitter,
        }),
        wait(0, emit, 'error', Error('hello')),
    ]);
    
    t.equal(e.message, 'hello');
    t.end();
});

test('flop: move', async (t) => {
    const rename = stub().resolves();
    
    await flop.move('/a', '/b', {
        rename,
    });
    
    t.calledWith(rename, ['/a', '/b'], 'should call rename');
    t.end();
});

test('flop: move: error', async (t) => {
    const rename = stub().rejects(createError('ENOENT'));
    
    const [error] = await tryToCatch(flop.move, '/a', '/b', {
        rename,
    });
    
    t.equal(error.code, 'ENOENT');
    t.end();
});

test('flop: move: EXDEV', async (t) => {
    const rename = stub().rejects(createError('EXDEV'));
    const copy = stub().resolves();
    const remove = stub().resolves();
    
    await flop.move('/a', '/b', {
        rename,
        copy,
        remove,
    });
    
    t.calledWith(remove, ['/a'], 'should remove source after copy');
    t.end();
});

test('flop: move: ENOTEMPTY', async (t) => {
    const rename = stub().rejects(createError('ENOTEMPTY'));
    const copy = stub().resolves();
    const remove = stub().resolves();
    
    await flop.move('/a', '/b', {
        rename,
        copy,
        remove,
    });
    
    t.calledWith(copy, ['/a', '/b'], 'should copy source');
    t.end();
});
