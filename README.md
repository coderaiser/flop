# Flop [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

FLOP - Folder operations module.

## Install
For use as application you could use global install.

```
npm i flop -g
```

If you run `flop -h` you will see:

```
flop - folder operations module.
options:
-h, --help - show this message
-r, --read - get directory content
```

Also you can use flop as a module if install with
```
npm i flop
```

## API

### create
Create new directory.

```js
const flop = require('flop');

flop.create('./hello/world/from/flop', (error, data) => {
    console.log(error, data);
});
```

### read
Read content of directory with permisions and sizes.

Parameters:
- path
- type (optional)
- options (optional)

Posible type:
- raw
- time
- size
- size raw

```js
const flop = require('flop');

await flop.read('.');
await flop.read('.', {sort: 'size'});
await flop.read('.', 'raw');
await flop.read('.', 'time');
await flop.read('.', 'size');
await flop.read('.', 'size raw');
```

### copy

```js
const flop = require('flop');

await flop.copy('from', 'to');
```

### move

```js
const flop = require('flop');

await flop.move('from', 'to');
```

### remove

```js
await flop.remove('path/to/remove');
await flop.remove('path/to/remove', ['folder1', 'folder2']);
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/flop.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/flop/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/flop.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/flop "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/flop  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/flop "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

