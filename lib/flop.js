'use strict';

const fs = require('fs');
const path = require('path');

const size = require('trammel');
const time = require('timem');
const check = require('checkup');
const copymitter = require('copymitter/legacy');
const remy = require('remy/legacy');
const mkdir = require('mkdirp');

const readify = require('readify/legacy');
const win = require('win32/legacy');

const flop = exports;

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
        options = {};
    }
    
    check
        .type('path', path, 'string')
        .type('callback', callback, 'function');
    
    switch (type) {
    case 'size':
        size(path, callback);
        break;
    
    case 'size raw':
        size(path, {type: 'raw'}, callback);
        break;
    
    case 'time':
        time(path, callback);
        break;
        
    case 'time raw':
        time(path, 'raw', callback);
        break;
    
    case 'raw':
        options.type = 'raw';
        readify(path, options, callback);
        break;
    
    default:
        if (isWin && path === '/')
            return getRoot(callback);
      
        readify(path, options, callback);
        break;
    }
};

exports.delete = (path, files, callback) => {
    let wasError;
    
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
            
            flop.delete(from, callback);
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
        
        if (!error)
            data.files = volumes.map((volume) => {
                return {
                    name: volume,
                    size: 'dir',
                    date: '--.--.----',
                    mode: '--- --- ---',
                    owner: 0
                };
            });
        
        callback(error, data);
    });
}

