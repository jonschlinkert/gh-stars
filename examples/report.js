'use strict';

var path = require('path');
var write = require('write-json');

var exclude = ['grunt', 'JSONStream', 'jsonstream', 'consolidate', 'dateformat', 'grunt-cli'];

function isValid(repo, stats) {
  if (repo.private === true || repo.fork === true) {
    return true;
  }
  if (/grunt-contrib/.test(repo.name)) {
    return true;
  }
  if (exclude.indexOf(repo.name) !== -1) {
    return true;
  }
  return stats.names.indexOf(repo.name) !== -1;
}
