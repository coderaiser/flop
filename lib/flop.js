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
        
        ncp         = require('ncp'),
        rimraf      = require('rimraf'),
        mkdir       = require('mkdirp');
    
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
            size(path, 'raw', callback);
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
            var isExDev = error && error.code === 'EXDEV';
            
            if (isExDev)
                ncp(from, to, function() {
                    rimraf(from, callback);
                });
            else
                callback(error);
        });
    };
    
    exports.copy    = function(from, to, callback) {
        Util.check(arguments, ['from', 'to', 'callback']);
        
        fs.lstat(from, function(error, stat) {
            var isDir = stat && stat.isDirectory();
            
            if (error)
                callback(error);
            else if (isDir)
                ncp(from, to, {
                    stopOnError: true
                }, callback);
            else
                files.pipe(from, to, callback);
        });
    };
})();
