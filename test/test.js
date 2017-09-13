'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth.js');
var stars = require('../');

describe('stars', function() {
  it('should catch error when invalid args are passed', function() {
    return stars()
      .catch(function(err) {
        assert(err);
      });
  });

  it('should catch error when "bad credentials" are passed', function() {
    this.timeout(10000);

    return stars('micromatch', {token: 'fososifdasifasifasifusaoifasoifusaoi'})
      .catch(function(err) {
        assert.deepEqual(err, {
          message: 'Bad credentials',
          documentation_url: 'https://developer.github.com/v3'
        });
      });
  });

  it('string username', function() {
    return stars('micromatch', Object.assign(auth, {format: 'raw'}))
      .then(function(res) {
        assert.equal(typeof res.total, 'number');
        assert(res.total > 1);
      });
  });

  it('array of usernames', function() {
    var opts = Object.assign(auth, {format: 'raw'});
    return stars(['micromatch', 'breakdance'], opts)
      .then(function(res) {
        assert.equal(typeof res.total, 'number');
        assert(res.total > 1);
      });
  });
});
