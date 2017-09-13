'use strict';

const pad = require('pad-left');
const repos = require('repos');

/**
 * Get the stars for one or more github users or organizations. Returns
 * JSON by default.
 *
 * ```js
 * var stars = require('gh-stars');
 *
 * stars(['doowb', 'jonschlinkert'], {token: 'YOUR_GITHUB_AUTH_TOKEN'})
 *   .then(function(res) {
 *     console.log(res);
 *   })
 *   .catch(console.error)
 * ```
 * @param {String|Array} `names` One or more GitHub user or organization names.
 * @param {Options} `options`
 * @return {Promise}
 * @api public
 */

module.exports = function(names, options) {
  return repos(names, options)
    .then(function(list) {
      return report(list, options);
    });
};

/**
 * Create report by filtering out repos (if specified), and
 * formatting the resulting list.
 */

function report(list, options) {
  const opts = Object.assign({format: 'json'}, options);
  const stats = filterList(list, opts);

  if (typeof opts.format === 'function') {
    return opts.format(stats);
  }
  return report[opts.format.toLowerCase()](stats);
}

/**
 * Format the list as JSON
 */

report.json = function(stats) {
  return JSON.stringify(stats, null, 2);
};

/**
 * Format the list as markdown
 */

report.markdown = function(stats) {
  let str = '| **Stars** | **Name** |\n| --- | --- |\n';
  for (let repo of stats.repos) {
    str += `| ${pad(String(repo.stars), 6, ' ')} | ${repo.name} |\n`;
  }
  str += `| ${pad(String(stats.total), 6, ' ')} | TOTAL |\n`;
  return str;
};

/**
 * Format the list as markdown
 */

report.md = function(stats) {
  return report.markdown(stats);
};

/**
 * Don't format the list, just return it as-is.
 */

report.raw = function(stats) {
  return stats;
};

/**
 * Filter the list
 */

function filterList(list, options) {
  const stats = { repos: [], total: 0};

  for (let repo of list) {
    if (isValid(repo, options.filter)) {
      repo.stars = +(repo['stargazers_count'] || 0);
      stats.repos.push(repo);
      stats.total += repo.stars;
    }
  }

  stats.repos.sort(function(a, b) {
    if (a.stars < b.stars) {
      return 1;
    }
    if (a.stars > b.stars) {
      return -1;
    }
    return 0;
  });

  return stats;
}

/**
 * Returns true if a repo should be excluded from the result
 */

function isValid(repo, filter) {
  if (typeof filter === 'function') {
    return filter(repo);
  }
  if (repo.private === true || repo.fork === true) {
    return false;
  }
  return true;
}
