'use strict'

var test = require('tape')
var temp = require('temp').track()
var fs = require('fs')
var path = require('path')
var glob = require('glob')
var pruneold = require('./')

test('delete old files if the size goes above threshold', function (t) {
  t.plan(3)

  var dir = temp.mkdirSync()
  var oldPath = path.join(dir, 'old')
  var newPath = path.join(dir, 'new')

  fs.writeFileSync(oldPath, new Buffer(1024 * 1024))
  fs.writeFileSync(newPath, new Buffer(1024))

  fs.utimesSync(oldPath, new Date(1984, 6, 26), new Date(1984, 6, 26))

  pruneold(dir, 10 * 1024, function (err) {
    t.error(err, 'no error')
    glob(path.join(dir, '**/*'), function (err, files) {
      t.error(err, 'no error')
      t.deepEqual(files, [newPath], 'only the new file is left')
    })
  })
})

test('does not delete anything if there is still space', function (t) {
  t.plan(3)

  var dir = temp.mkdirSync()
  var oldPath = path.join(dir, 'old')
  var newPath = path.join(dir, 'new')

  fs.writeFileSync(oldPath, new Buffer(1024 * 1024))
  fs.writeFileSync(newPath, new Buffer(1024))

  fs.utimesSync(oldPath, new Date(1984, 6, 26), new Date(1984, 6, 26))

  pruneold(dir, 10 * 1024 * 1024, function (err) {
    t.error(err, 'no error')
    glob(path.join(dir, '**/*'), function (err, files) {
      t.error(err, 'no error')
      t.deepEqual(files, [newPath, oldPath], 'both the new and old files are there')
    })
  })
})
