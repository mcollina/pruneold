# pruneold&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/pruneold.png)](https://travis-ci.org/mcollina/pruneold)

Prune old files from a directory so that the folder maintains a max
size.
This is useful to implement a file system cache

```js

var pruneold = require('pruneold')

pruneold(
  '/path/to/a/folder',
  10 * 1024, // max size in bytes
  function (err) {
    // this will called after the pruning
  })
```

## Acknowledgements

This project was kindly sponsored by [nearForm](http://nearform.com).

## License

MIT
