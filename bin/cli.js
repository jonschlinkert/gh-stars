#!/usr/bin/env node

var stars = require('../');
var argv = require('minimist')(process.argv.slice(2));
var write = require('write');
var ok = require('log-ok');

var type = argv.format || 'md';
var dest = argv._[1];

if (!dest) {
  switch (type) {
    case 'json':
      dest = 'stars.json';
      break;
    case 'markdown':
    case 'md':
    default: {
      dest = 'stars.md';
      break;
    }
  }
}

stars(argv._[0].split(','), Object.assign({format: type}, argv))
  .then(function(res) {
    write(dest, res, function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      ok('done');
      process.exit();
    });
  });
