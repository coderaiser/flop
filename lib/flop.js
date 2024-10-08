'use strict';

const {rename, mkdir} = require('node:fs/promises');
const path = require('node:path');

const {once} = require('node:events');

const size = require('trammel');
const check = require('checkup');
const copymitter = require('copymitter');
const remy = require('remy');
const tryToCatch = require('try-to-catch');

const {read} = require('win32');

const flop = exports;

const isStr = (a) => typeof a === 'string';

module.exports.create = async (path) => {
    check.type('path', path, 'string');
    
    await mkdir(path, {
        recursive: true,
    });
};

module.exports.read = async (path, type, options = {}) => {
    options = isStr(type) ? {} : type;
    
    check.type('path', path, 'string');
    
    switch(type) {
    case 'size':
        return await size(path);
    
    case 'size raw':
        return await size(path, {
            type: 'raw',
        });
    
    case 'raw':
        options.type = 'raw';
        return await read(path, options);
    
    default:
        return await read(path, options);
    }
};

module.exports.remove = async (path, files) => {
    check.type('path', path, 'string');
    
    const rm = remy(path, files);
    
    const [error] = await Promise.race([
        once(rm, 'error'),
        once(rm, 'end'),
    ]);
    
    if (error)
        throw error;
};

module.exports.move = async (from, to) => {
    check
        .type('from', from, 'string')
        .type('to', to, 'string');
    
    const [error] = await tryToCatch(rename, from, to);
    const regexp = /EXDEV|ENOTEMPTY/;
    
    if (!error)
        return;
    
    if (!regexp.test(error.code))
        throw error;
    
    await flop.copy(from, to);
    await flop.remove(from);
};

module.exports.copy = async (from, to) => {
    check
        .type('from', from, 'string')
        .type('to', to, 'string');
    
    const name = path.basename(from);
    const fromPart = from.replace(name, '');
    const toPart = to.replace(name, '');
    
    const cp = copymitter(fromPart, toPart, [name]);
    
    const [error] = await Promise.race([
        once(cp, 'error'),
        once(cp, 'end'),
    ]);
    
    if (error)
        throw error;
};
