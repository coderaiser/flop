#!/usr/bin/env node

'use strict';

const minimist = require('minimist');
const flop = require('..');
const argv = minimist(process.argv.slice(2));

let path;
const keys = Object.keys(argv);

if (keys.length === 1)
    if (argv._.length)
        unknown();
    else
        help();
else
    keys.some((name) => {
        let isDone = true;
        
        if (name === 'h' || name === '')
            name = 'help';
        
        switch(name) {
        case 'help':
            help();
            break;
        
        case 'read':
            path = argv.read;
            break;
        
        case 'r':
            path = argv.r;
            break;
        
        case '_':
            isDone = false;
            break;
        
        default:
            isDone = true;
            unknown();
        }
        
        return isDone;
    });

if (path)
    flop.read(path, (error, data) => {
        if (error)
            return console.log(error);
        
        console.log(data);
    });

function help() {
    const message = 'flop - folder operations module.\n'        +
                    'options: \n'                               +
                    '-h, --help - show this message\n'          +
                    '-r, --read - get directory content\n';
    
    console.log(message);
}

function unknown() {
    const message = 'Unknown parameter. For help use: flop -h';
    
    console.log(message);
}

