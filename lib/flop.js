'use strict';

const fs = require('fs');
const path = require('path');
const {callbackify} = require('util');

const size = require('trammel');
const time = require('timem');
const check = require('checkup');
const copymitter = require('copymitter');
const remy = require('remy');
const mkdir = require('mkdirp');

const readify = callbackify(require('readify'));
const win = require('win32');

const flop = exports;

const isStr = (a) => typeof a === 'string';
const isWin = process.platform === 'win32';

exports.create = (path, callback) => {
    check
        .type('path', path, 'string')
        .type('callback', callback, 'function');
    
    mkdir(path, callback);
};

exports.read = (path, type, options, callback) => {
    if (!callback && !options) {
        callback = type;
        options = {};
    } else if (!callback) {
        callback = options;
        options = isStr(type) ? {} : type;
    }
    
    check
        .type('path', path, 'string')
        .type('callback', callback, 'function');
    
    switch (type) {
    case 'size':
        return size(path, callback);
    
    case 'size raw':
        return size(path, {type: 'raw'}, callback);
    
    case 'time':
        return time(path, callback);
    
    case 'time raw':
        return time(path, 'raw', callback);
    
    case 'raw':
        options.type = 'raw';
        return readify(path, options, callback);
    
    default:
        if (isWin && path === '/')
            return getRoot(callback);
      
        return readify(path, options, callback);
    }
};

exports.remove = (path, files, callback) => {
    if (!callback) {
        callback    = files;
        files       = null;
    }
    
    check
        .type('path', path, 'string')
        .type('callback', callback, 'function');
    
    remy(path, files)
        .on('error', callback)
        .on('end', callback);
};

exports.move = (from, to, callback) => {
    check
        .type('from', from, 'string')
        .type('to', to, 'string')
        .type('callback', callback, 'function');
    
    fs.rename(from, to, (error) => {
        const regexp = /EXDEV|ENOTEMPTY/;
        
        if (!error || !regexp.test(error.code))
            return callback(error);
        
        flop.copy(from, to, (error) => {
            if (error)
                return callback(error);
            
            flop.remove(from, callback);
        });
    });
};

exports.copy = (from, to, callback) => {
    check
        .type('from', from, 'string')
        .type('to', to, 'string')
        .type('callback', callback, 'function');
    
    const name = path.basename(from);
    const fromPart = from.replace(name, '');
    const toPart = to.replace(name, '');
    
    copymitter(fromPart, toPart, [name])
        .on('error', callback)
        .on('end', callback);
};

function getRoot(callback) {
    win.getVolumes((error, volumes) => {
        const data = {
            path    : '/',
            files   : []
        };
        
        if (error)
            return callback(error);
        
        data.files = volumes.map((volume) => {
            return {
                name: volume,
                type: 'directory',
                size: 0,
                date: '--.--.----',
                mode: '--- --- ---',
                owner: 0
            };
        });
        
        callback(null, data);
    });
}

