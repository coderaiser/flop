/*
 * FLOP - simple FoLder OPerations
 */

(function() {
    'use strict';
    
    var fs          = require('fs'),
        
        readify     = require('readify'),
        size        = require('trammel'),
        files       = require('files-io'),
        Util        = require('util-io'),
        time        = require('timem'),
        
        ncp         = require('./ncp'),
        rimraf      = require('rimraf'),
        mkdir       = require('mkdirp'),
        
        flop        = exports;
    
    exports.create  = function(path, type, callback) {
        Util.check(arguments, ['path', 'callback']);
        
        mkdir(path, callback);
    };
    
    exports.read    = function(path, type, callback) {
        Util.check(arguments, ['path', 'callback']);
        
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
        Util.check(arguments, ['path', 'callback']);
        
        rimraf(path, callback);
    };
    
    exports.move    = function(from, to, callback) {
        Util.check(arguments, ['path', 'to', 'callback']);
        
        fs.rename(from, to, function(error) {
            if (!error || error.code !== 'EXDEV')
                callback(error);
            else
                flop.cp(from, to, function(error) {
                    if (error)
                        callback(error);
                    else
                        flop.delete(from, callback);
                });
        });
    };
    
    exports.copy    = function(from, to, callback) {
        Util.check(arguments, ['from', 'to', 'callback']);
        
        files.pipe(from, to, function(error) {
            if (!error || error.code !== 'EISDIR')
                callback(error);
            else
                ncp(from, to, {
                    stopOnError: true
                }, callback);
        });
    };
})();
