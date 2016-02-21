/*
 * FLOP - simple FoLder OPerations
 */

(function() {
    'use strict';
    
    var fs          = require('fs'),
        path        = require('path'),
        readify     = require('readify'),
        size        = require('trammel'),
        
        check       = require('checkup'),
        time        = require('timem'),
        win         = require('win32'),
        
        copymitter  = require('copymitter'),
        remy        = require('remy'),
        mkdir       = require('mkdirp'),
        
        flop        = exports,
        
        isWin       = process.platform === 'win32';
    
    exports.create  = function(path, callback) {
        check
            .type('path', path, 'string')
            .type('callback', callback, 'function');
        
        mkdir(path, callback);
    };
    
    exports.read    = function(path, type, callback) {
        if (!callback)
            callback = type;
        
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
        
        default:
            if (isWin && path === '/')
                getRoot(callback);
            else
                readify(path, callback);
            break;
        }
    };
    
    exports.delete  = function(path, files, callback) {
        var wasError, rm;
        
        if (!callback) {
            callback    = files;
            files       = null;
        }
        
        check
            .type('path', path, 'string')
            .type('callback', callback, 'function');
        
        rm = remy(path, files);
        
        rm.on('error', function(error) {
            callback(error);
            wasError = true;
            rm.abort();
        });
        
        rm.on('end', function() {
            if (!wasError)
                callback();
        });
    };
    
    exports.move    = function(from, to, callback) {
        check
            .type('from', from, 'string')
            .type('to', to, 'string')
            .type('callback', callback, 'function');
        
        fs.rename(from, to, function(error) {
            var regexp = /EXDEV|ENOTEMPTY/;
            
            if (!error || !regexp.test(error.code))
                callback(error);
            else
                flop.copy(from, to, function(error) {
                    if (error)
                        callback(error);
                    else
                        flop.delete(from, callback);
                });
        });
    };
    
    exports.copy    = function(from, to, callback) {
        var wasError, cp, fromPart, toPart, name;
        
        check
            .type('from', from, 'string')
            .type('to', to, 'string')
            .type('callback', callback, 'function');
        
        name        = path.basename(from);
        fromPart    = from.replace(name, '');
        toPart      = to.replace(name, '');
        
        cp = copymitter(fromPart, toPart, [name]);
        
        cp.on('error', function(error) {
            callback(error);
            wasError = true;
            cp.abort();
        });
        
        cp.on('end', function() {
            if (!wasError)
                callback();
        });
    };
    
    function getRoot(callback) {
        win.getVolumes(function(error, volumes) {
            var data = {
                path    : '/',
                files   : []
            };
            
            if (!error)
                data.files = volumes.map(function(volume) {
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
    
})();
