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

Also you can use flop as an [ESM](https://nodejs.org/api/esm.html) module if install with

```
npm i flop
```

## API

### create

Create new directory.

```js
import * as flop from 'flop';

await flop.create('./hello/world/from/flop');
```

### read

Read content of directory with permisions and sizes.

Parameters:

- path
- type or options (optional)

Posible type:

- raw
- size
- size raw

```js
import * as flop from 'flop';

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
import * as flop from 'flop';

await flop.copy('from', 'to');
```

### move

```js
import * as flop from 'flop';

await flop.move('from', 'to');
```

### remove

```js
import * as flop from 'flop';

await flop.remove('path/to/remove');
await flop.remove('path/to/remove', ['folder1', 'folder2']);
```

## License

MIT
