// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    files: [
      {
        pattern: './../../node_modules/monaco-editor/min/**/*.js',
        watched: false,
        included: false,
        served: true
      },
      {
        pattern: './../../node_modules/monaco-editor/min/**/*.css',
        watched: false,
        included: false,
        served: true
      }
    ],
    proxies: {
      '/assets/monaco/':
        '/absolute' + path.resolve('./node_modules/monaco-editor/min/')
    },

    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222'
        ]
      }
    }
  });
};
