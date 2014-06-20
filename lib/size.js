/* inspired by http://procbits.com/2011/10/29/a-node-js-experiment-thinking-asynchronously-recursion-calculate-file-size-directory */
(function(){
    'use strict';
    
    var fs          = require('fs'),
        path        = require('path'),
        
        DIR         = '../',
        DIR_SERVER  = DIR + 'lib/',
        
        format      = require(DIR_SERVER + 'format'),
        Util        = require('util-io'),
        
        /*  The lstat() function shall be equivalent to stat(),
            except when path refers to a symbolic link. In that case lstat()
            shall return information about the link, while stat() shall return
            information about the file the link references. 
        */
        stat    = fs.lstat;
    
    exports.get = function(dir, type, callback) {
        var total          = 0;
        
        Util.checkArgs(arguments, ['dir', 'callback']);
        
        if (!callback)
            callback = type;
        
        function calcSize(stat) {
            var size   = stat && stat.size || 0;
            
            total      += size;
        }
        
        processDir(dir, calcSize, function(error) {
            var result;
            
            if (type !== 'raw')
                result  = format.size(total);
            else
                result  = total;
            
            Util.exec(callback, error, result);
        });
    };
   
    function processDir(dir, func, callback) {
        var asyncRunning   = 0,
            fileCounter    = 1;
        
        function getDirInfo(dir) {
            stat(dir, Util.exec.with(getStat, dir));
        }
        
        function getStat(dir, error, stat) {
            --fileCounter;
            
            if (error)
                callback(error);
            else
                if (stat.isFile())
                    Util.exec(func, stat);
                else if (stat.isDirectory()) {
                    ++asyncRunning;
                    
                    fs.readdir(dir, function(error, files) {
                        var dirPath, file, n, i;
                        
                        asyncRunning--;
                        
                        if (!error) {
                            n               = files.length;
                            fileCounter    += n;
                            
                            for (i = 0; i < n; i++) {
                                file        = files[i];
                                dirPath     = path.join(dir, file);
                                
                                process.nextTick(getDirInfo.bind(null, dirPath));
                            }
                        }
                        
                        if (!n)
                            execCallBack();
                    });
                }
            
            execCallBack();
        }
        
        function execCallBack() {
            if (!fileCounter && !asyncRunning)
                Util.exec(callback);
        }
        
        getDirInfo(dir);
    }
    
})();
