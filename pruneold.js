'use strict'

var glob = require('glob')
var path = require('path')
var rimraf = require('rimraf')
var series = require('fastseries')()

function pruneold (dir, max, callback) {
  // we have glob() perform the stat for us
  // so we can access the size of all files
  // synchronously
  var statCache = {}

  // we need a full path, so resolve relative ones
  dir = path.resolve(dir)

  glob(path.join(dir, '**/*'), {
    statCache: statCache,

    // stat all files, even when not needed
    // this reduces performance, but we would
    // have to do it anyway
    stat: true,

    // we are not interested in directories
    nodir: true
  }, function (err, files) {
    if (err) {
      return callback(err)
    }

    var total = files.reduce(function count (acc, file) {
      return acc + statCache[file].size
    }, 0)

    files = files.sort(function sortByMTime (a, b) {
      var atime = statCache[a].mtime
      var btime = statCache[b].mtime

      if (atime === btime) {
        return 0
      } else if (atime > btime) {
        return 1
      } else {
        return -1
      }
    })

    var toRemove = files.filter(function upToMax (file) {
      if (total <= max) {
        return false
      }

      total -= statCache[file].size

      return true
    })

    series(null, rimraf, toRemove, callback)
  })
}

module.exports = pruneold
