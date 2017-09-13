'use strict';

const write = require('write');
const token = require('../tmp/token');
const stars = require('../');

stars(['doowb'], {token: token, type: 'markdown'})
  .then(function(stats) {
    // write.sync('report.json', report(repos));
    console.log(stats)
  })
  .catch(console.error);
