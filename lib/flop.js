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
        
        copymitter  = require('copymitter'),
        rimraf      = require('rimraf'),
        mkdir       = require('mkdirp'),
        
        flop        = exports;
    
    exports.create  = function(path, type, callback) {
        check(arguments, ['path', 'callback']);
        
        mkdir(path, callback);
    };
    
    exports.read    = function(path, type, callback) {
        check(arguments, ['path', 'callback']);
        
        if (!callback)
            callback = type;
        
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
            readify(path, callback);
            break;
        }
    };
    
    exports.delete  = function(path, callback) {
        check(arguments, ['path', 'callback']);
        
        rimraf(path, callback);
    };
    
    exports.move    = function(from, to, callback) {
        check(arguments, ['path', 'to', 'callback']);
        
        fs.rename(from, to, function(error) {
            if (!error || error.code !== 'EXDEV')
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
        
        check(arguments, ['from', 'to', 'callback']);
        
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
})();
