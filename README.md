#flop

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
- callback

Posible type:
- raw
- time
- size
- size raw

```js
const flop = require('flop');

flop.read('.', (error, data) => {
    console.log(error, data);
});

flop.read('.', {sort: 'size'}, (error, data) => {
    console.log(error, data);
});

flop.read('.', 'raw', (error, data) => {
    console.log(error, data);
});


flop.read('.', 'time', (error, data) => {
    console.log(error, data);
});

flop.read('.', 'size', (error, data) => {
    console.log(error, data);
});

flop.read('.', 'size raw', (error, data) => {
    console.log(error, data);
});
```

### copy

```js
const flop = require('flop');

flop.copy('from', 'to', (error) => {
    console.log(error);
});
```

### move

```js
const flop = require('flop');

flop.move('from', 'to', (error) => {
    console.log(error);
});
```

### delete

```js
flop.delete('path/to/delete', (error) => {
    console.log(error);
});

flop.delete('path/to/delete', ['folder1', 'folder2'], (error) => {
    console.log(error);
});
```

## Environments

In old `node.js` environments that supports `es5` only, `flop` could be used with:

```js
var flop = require('flop/legacy');
```

## License

MIT

