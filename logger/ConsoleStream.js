'use strict';

const chalk = require('chalk');
const Stream = require('stream').Stream;

const levelNames = {
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO',
  40: 'WARN',
  50: 'ERROR',
  60: 'FATAL'
};

const levelColors = {
  10: 'gray',
  20: 'gray',
  30: 'green',
  40: 'yellow',
  50: 'red',
  60: 'magenta'
};

const httpStatusColors = {
  5: 'red',
  4: 'yellow',
  3: 'cyan',
  2: 'green',
  1: 'green'
};

function defaultFilter() {
  return true;
}

function ConsoleStream(options) {
  Stream.call(this);

  options = options || {};

  this.filter = options.filter || defaultFilter;
}

ConsoleStream.prototype.write = function(rec) {
  if (!this.filter(rec)) return;

  let level = rec.level;
  let log = '';

  // Time
  log += chalk.gray(rec.time.toISOString()) + ' ';

  // Level
  log += chalk[levelColors[level]](levelNames[level]) + ' ';

  if (rec.type) {
    log += chalk.gray(rec.type) + ' ';
  }

  if (rec.type === 'http') {
    if (rec.msg) log += rec.msg;

    // Status
    log += chalk[httpStatusColors[(rec.status / 100) | 0]](rec.status) + ' ';

    // URL
    log += rec.url + ' ';

    // Length
    if (rec.length) {
      log += rec.length + ' ';
    } else {
      log += '- ';
    }

    // Duration
    log += (rec.time.getTime() - rec.start.getTime()) + 'ms\n';
  } else {
    log += (rec.msg || '') + '\n';
  }

  if (rec.err) {
    let err = rec.err.stack || rec.err.message;
    if (err) log += chalk.gray(err) + '\n';
    process.stderr.write(log);
  } else {
    process.stdout.write(log);
  }
};

module.exports = ConsoleStream;
