const Logr = require('logr');
const aug = require('aug');

module.exports = (overrides) => {
  const enabledReporters = (process.env.LOGR) ? process.env.LOGR.split(',') : ['logfmt'];
  const color = process.env.LOGR_COLOR ? true : false;
  const reporters = {
    json: {
      reporter: require('logr-json'),
      options: {
        enabled: enabledReporters.includes('json')
      }
    },
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
        timestamp: false,
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
    slack: {
      reporter: require('logr-slack'),
      options: {
        enabled: process.env.SLACK_HOOK ? true : false,
        slackHook: process.env.SLACK_HOOK,
        channel: process.env.SLACK_CHANNEL,
        username: process.env.SLACK_USERNAME ? process.env.SLACK_USERNAME : 'logr',
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
