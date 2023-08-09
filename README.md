# Flop [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

[NPMIMGURL]: https://img.shields.io/npm/v/flop.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/flop/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/flop/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/flop "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"

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
- size
- size raw

```js
const flop = require('flop');

await flop.read('.');
await flop.read('.', {
    sort: 'size',
});
await flop.read('.', 'raw');
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
