/*
 * FLOP - simple FoLder OPerations
 */

(function() {
    'use strict';
    
    var fs          = require('fs'),
        path        = require('path'),
        readify     = require('readify'),
        size        = require('trammel'),
        
        assert      = require('assert'),
        time        = require('timem'),
        
        copymitter  = require('copymitter'),
        rimraf      = require('rimraf'),
        mkdir       = require('mkdirp'),
        
        flop        = exports;
    
    exports.create  = function(path, callback) {
        [path, callback].forEach(assert);
        
        mkdir(path, callback);
    };
    
    exports.read    = function(path, type, callback) {
        if (!callback)
            callback = type;
        
        [path, callback].forEach(assert);
        
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
        [path, callback].forEach(assert);
        
        rimraf(path, callback);
    };
    
    exports.move    = function(from, to, callback) {
        [path, to, callback].forEach(assert);
        
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
        
        [from, to, callback].forEach(assert);
        
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
