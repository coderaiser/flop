'use strict';

const fs = require('fs').promises;
const path = require('path');
const {promisify} = require('util');

const size = require('trammel');
const time = require('timem');
const check = require('checkup');
const copymitter = require('copymitter');
const remy = require('remy');
const mkdir = require('mkdirp');
const tryToCatch = require('try-to-catch');

const readify = require('readify');
const getVolumes = promisify(require('win32').getVolumes);

const flop = exports;

const isStr = (a) => typeof a === 'string';
const isWin = process.platform === 'win32';

exports.create = async (path) => {
    check.type('path', path, 'string');
    
    await mkdir(path);
};

exports.read = async (path, type, options = {}) => {
    options = isStr(type) ? {} : type;
    
    check.type('path', path, 'string');
    
    switch(type) {
    case 'size':
        return await size(path);
    
    case 'size raw':
        return await size(path, {type: 'raw'});
    
    case 'time':
        return await time(path);
    
    case 'time raw':
        return await time(path, 'raw');
    
    case 'raw':
        options.type = 'raw';
        return await readify(path, options);
    
    default:
        if (isWin && path === '/')
            return await getRoot();
        
        return await readify(path, options);
    }
};

exports.remove = promisify((path, files, callback) => {
    check.type('path', path, 'string');
    
    if (!callback) {
        callback = files;
        files = null;
    }
    
    remy(path, files)
        .on('error', callback)
        .on('end', callback);
});

exports.move = async (from, to) => {
    check
        .type('from', from, 'string')
        .type('to', to, 'string');
    
    const [error] = await tryToCatch(fs.rename, from, to);
    const regexp = /EXDEV|ENOTEMPTY/;
    
    if (!error)
        return;
    
    if (!regexp.test(error.code))
        throw error;
    
    await flop.copy(from, to);
    await flop.remove(from);
};

exports.copy = promisify((from, to, callback) => {
    check
        .type('from', from, 'string')
        .type('to', to, 'string');
    
    const name = path.basename(from);
    const fromPart = from.replace(name, '');
    const toPart = to.replace(name, '');
    
    copymitter(fromPart, toPart, [name])
        .on('error', callback)
        .on('end', callback);
});

async function getRoot() {
    const volumes = await getVolumes();
    
    const data = {
        path    : '/',
        files   : [],
    };
    
    data.files = volumes.map((name) => {
        return {
            name,
            type: 'directory',
            size: 0,
            date: '--.--.----',
            mode: '--- --- ---',
            owner: 0,
        };
    });
    
    return data;
}

