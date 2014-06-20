#flop

FLOP - Folder operations module.

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