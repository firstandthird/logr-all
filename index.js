const Logr = require('logr');
const aug = require('aug');

module.exports = (overrides) => {
  const enabledReporters = (process.env.LOGR) ? process.env.LOGR.split(',') : ['logfmt'];
  const color = process.env.LOGR_COLOR ? true : false;
  const reporters = {
    logfmt: {
      reporter: require('logr-logfmt'),
      options: {
        color,
        enabled: enabledReporters.includes('logfmt')
      }
    },
    flat: {
      reporter: require('logr-flat'),
      options: {
        appColor: color,
        enabled: enabledReporters.includes('flat')
      }
    },
    bell: {
      reporter: require('logr-reporter-bell'),
      options: {
        enabled: enabledReporters.includes('bell')
      }
    },
    console: {
      reporter: require('logr-console-color'),
      options: {
        timestamp: false,
        appColor: true,
        enabled: enabledReporters.includes('console')
      }
    },
    sentry: {
      reporter: require('logr-sentry'),
      options: {
        environment: process.env.NODE_ENV || 'development',
        enabled: process.env.SENTRY_DSN !== undefined,
        dsn: process.env.SENTRY_DSN,
        filter: process.env.LOGR_SENTRY_FILTER ? process.env.LOGR_SENTRY_FILTER.split(',') : ['error']
      }
    },
    slack: {
      reporter: require('logr-slack'),
      options: {
        enabled: process.env.SLACK_HOOK !== undefined,
        slackHook: process.env.SLACK_HOOK,
        filter: process.env.LOGR_SLACK_FILTER ? process.env.LOGR_SLACK_FILTER.split(',') : ['error']
      }
    },
  };
  const defaults = {
    initLog: true,
    reporters
  };

  const options = aug(defaults, overrides);
  return Logr.createLogger(options);
}
