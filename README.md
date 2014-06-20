#flop

FLOP - Folder operations module.

## Install
For use as application you could use global install.

```
    npm i flop -g
````

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

## read
Read content of directory with permisions and sizes.

Parameters:
- path
- options (optional)
- callback

Posible options:
- time
- size
- size raw

```js
    var flop = reauire('flop');
    
    flop.read('.', function(error, data) {
        console.log(error, data);
    });
    
    flop.read('.', 'time', function(error, data) {
        console.log(error, data);
    });
    
    flop.read('.', 'size', function(error, data) {
        console.log(error, data);
    });
    
    flop.read('.', 'size raw', function(error, data) {
        console.log(error, data);
    });
```
## copy
## move
## delete