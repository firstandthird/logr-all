'use strict';
const tap = require('tap');
const test = tap.test;
const logrAll = require('../');

test('provide a logger function', (t) => {
  const log = logrAll();
  log(['tag'], 'hi');
  t.end();
});

test('override default options', (t) => {
  const logs = [];
  const log = logrAll({
    initLog: false,
    logger(msg) {
      logs.push(msg);
    },
  });
  log(['tag'], 'hi');
  t.equal(logs.length, 1);
  t.end();
});

test('reporter - use env var to enable reporters', (t) => {
  process.env.LOGR = 'console,flat';
  const logs = [];
  const log = logrAll({
    initLog: false,
    logger(msg) {
      logs.push(msg);
    },
  });
  log({ value: 'hi' });
  t.equal(logs.length, 2);
  t.match(logs[0], '\u001b[90mvalue:\u001b[39m\u001b[37mhi\u001b[39m ');
  t.match(logs[1], '\u001b[1mvalue\u001b[22m\u001b[36m: \u001b[39m\u001b[36m"\u001b[39m\u001b[32mhi\u001b[39m\u001b[36m"\u001b[39m');
  t.end();
});

test('reporter - use env var to enable bell', (t) => {
  process.env.LOGR = 'bell';
  const log = logrAll();
  log({ value: 'hi' });
  t.end();
  delete process.env.LOGR;
});

test('SENTRY_DSN and LOGR_SENTRY_FILTER', (t) => {
  process.env.SENTRY_DSN = 'https://key@localhost:8080/dummy';
  process.env.LOGR_SENTRY_FILTER = 'debug,error,info';
  const logs = [];
  const log = logrAll({
    environment: 'test',
    logger: 'logr-test',
    logger(msg) {
      logs.push(msg);
    },
  });
  log(['debug'], { value: 'hi' });
  t.end();
  delete process.env.SENTRY_DSN;
  delete process.env.LOGR_SENTRY_FILTER;
});

test('SLACK_HOOK', (t) => {
  process.env.SLACK_HOOK = 'https://key@localhost:8080/dummy';
  process.env.LOGR_SLACK_FILTER = 'debug,error,info';
  const logs = [];
  const log = logrAll({
    logger(msg) {
      logs.push(msg);
    },
  });
  log({ value: 'hi' });
  t.end();
  delete process.env.SLACK_HOOK;
  delete process.env.LOGR_SLACK_FILTER;
});
