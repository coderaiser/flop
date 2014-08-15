/*
 * FLOP - simple FoLder OPerations
 */

(function() {
    'use strict';
    
    var fs          = require('fs'),
        DIR         = './lib/',
        
        
        commander   = require(DIR + 'commander'),
        ncp         = require(DIR + 'ncp'),
        
        size        = require('trammel'),
        pipe        = require('pipe-io'),
        Util        = require('util-io'),
        time        = require('timem'),
        
        
        rimraf      = tryRequire('rimraf'),
        mkdir       = tryRequire('mkdirp') || fs.mkdir;
    
    exports.create  = function(path, type, callback) {
        Util.checkArgs(arguments, ['path', 'callback']);
        
        mkdir(path, callback);
    };
    
    exports.read    = function(path, type, callback) {
        Util.checkArgs(arguments, ['path', 'callback']);
        
        if (!callback)
            callback = type;
        
        switch (type) {
        case 'size':
            size.get(path, callback);
            break;
        
        case 'size raw':
            size.get(path, 'raw', callback);
            break;
        
        case 'time':
            time.get(path, callback);
            break;
            
        case 'time raw':
            time.get(path, 'raw', callback);
            break;
        
        default:
            commander.getDirContent(path, callback);
            break;
        }
    };
    
    exports.delete  = function(path, callback) {
        Util.checkArgs(arguments, ['path', 'callback']);
        
        if (rimraf)
            rimraf(path, callback);
        else
            fs.unlink(path, function(error) {
                var isDir = error && error.code === 'EISDIR';
                
                if (isDir)
                    fs.rmdir(path, callback);
                else
                    callback(error);
            });
    };
    
    exports.move    = function(from, to, callback) {
        Util.checkArgs(arguments, ['path', 'to', 'callback']);
        
        fs.rename(from, to, function(error) {
            var isExDev = error && error.code === 'EXDEV';
            
            if (ncp && rimraf && isExDev)
                ncp(from, to, function() {
                    rimraf(from, callback);
                });
            else
                callback(error);
        });
    };
    
    exports.copy    = function(from, to, callback) {
        Util.checkArgs(arguments, ['from', 'to', 'callback']);
        
        pipe.create(from, to, function(error) {
            var isDir = error && error.code === 'EISDIR';
            
            if (isDir)
                ncp(from, to, callback);
            else
                callback(error);
        });
    };
    
    function tryRequire(name) {
        var module;
        
        Util.exec.try(function() {
            module = require(name);
        });
        
        return module;
    }
})();
