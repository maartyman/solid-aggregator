const antfu = require('@antfu/eslint-config');
const generalConfig = require('./eslint/general');
const testConfig = require('./eslint/test');
const typedConfig = require('./eslint/typed');
const unicornConfig = require('./eslint/unicorn');

module.exports = antfu.default(
  {
    ignores: [ 'lib/**/*.js', 'lib/**/*.d.ts', '**/*.md' ],
  },
  generalConfig,
  unicornConfig,
  typedConfig,
  testConfig,
  {
    // JSON rules
    files: [ '**/*.json' ],
    rules: {
      'jsonc/array-bracket-spacing': [ 'error', 'always', {
        singleValue: true,
        objectsInArrays: false,
        arraysInArrays: false,
      }],
    },
  },
);
