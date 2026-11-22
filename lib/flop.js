import {rename as _rename, mkdir as _mkdir} from 'node:fs/promises';
import path from 'node:path';
import {once} from 'node:events';
import _size from 'trammel';
import check from 'checkup';
import {copymitter as _copymitter} from 'copymitter';
import _remy from 'remy';
import {tryToCatch} from 'try-to-catch';
import {read as _readWin32} from 'win32';

const isStr = (a) => typeof a === 'string';

export const create = async (path, overrides = {}) => {
    const {mkdir = _mkdir} = overrides;
    
    check.type('path', path, 'string');
    
    await mkdir(path, {
        recursive: true,
    });
};

export const read = async (path, type, overrides = {}) => {
    const {
        readWin32 = _readWin32,
        size = _size,
    } = overrides;
    const options = isStr(type) ? {} : type;
    
    check.type('path', path, 'string');
    
    if (type === 'size')
        return await size(path);
    
    if (type === 'size raw')
        return await size(path, {
            type: 'raw',
        });
    
    if (type === 'raw')
        options.type = 'raw';
    
    return await readWin32(path, options);
};

export const remove = async (path, files, overrides = {}) => {
    const {remy = _remy} = overrides;
    check.type('path', path, 'string');
    
    const rm = remy(path, files);
    
    const [error] = await tryToCatch(once, rm, 'end');
    
    if (error)
        throw error;
};

export const move = async (from, to, overrides = {}) => {
    const {
        rename = _rename,
        copy: _copy = copy,
        remove: _remove = remove,
    } = overrides;
    
    check
        .type('from', from, 'string')
        .type('to', to, 'string');
    
    const [error] = await tryToCatch(rename, from, to);
    const regexp = /EXDEV|ENOTEMPTY/;
    
    if (!error)
        return;
    
    if (!regexp.test(error.code))
        throw error;
    
    await _copy(from, to);
    await _remove(from);
};

export const copy = async (from, to, overrides = {}) => {
    const {copymitter = _copymitter} = overrides;
    
    check
        .type('from', from, 'string')
        .type('to', to, 'string');
    
    const name = path.basename(from);
    const fromPart = from.replace(name, '');
    const toPart = to.replace(name, '');
    
    const cp = copymitter(fromPart, toPart, [name]);
    
    const [error] = await tryToCatch(once, cp, 'end');
    
    if (error)
        throw error;
};
