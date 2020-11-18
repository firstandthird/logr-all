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
  t.match(logs[0], 'value:hi ');
  t.match(logs[1], '\n  value: "hi"');
  t.end();
});

test('reporter - use env var to enable bell', (t) => {
  process.env.LOGR = 'bell';
  const log = logrAll();
  log({ value: 'hi' });
  t.end();
  delete process.env.LOGR;
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
