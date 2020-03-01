'use strict';

const {run} = require('madrun');

module.exports = {
    'lint': () => 'putout lib test .madrun.js',
    'fix:lint': () => run('lint', '--fix'),
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'coverage': () => 'nyc npm test',
    'test': () => 'tape test/*.js',
    'watch:coverage': () => run('watcher', 'npm run coverage'),
    'watch:test': () => run('watcher', 'npm test'),
    'watcher': () => 'nodemon -w test -w lib --exec',
};

