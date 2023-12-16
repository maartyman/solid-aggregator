const os = require('node:os');
const v8 = require('node:v8');

// Several parts inspired by https://github.com/renovatebot/renovate/blob/main/package.json

const ci = Boolean(process.env.CI);

const cpus = os.cpus();
const mem = os.totalmem();
const stats = v8.getHeapStatistics();

if (ci) {
  process.stderr.write(`Host stats:
  Cpus:      ${cpus.length}
  Memory:    ${(mem / 1024 / 1024 / 1024).toFixed(2)} GB
  HeapLimit: ${(stats.heap_size_limit / 1024 / 1024 / 1024).toFixed(2)} GB
`);
}

module.exports = {
  transform: {
    '^.+\\.ts$': [ 'ts-jest', {
      // Enabling this can fix issues when using prereleases of typings packages
      // isolatedModules: true
    }],
  },
  testRegex: [ '/test/.*-test.*.ts$' ],
  moduleFileExtensions: [
    'ts',
    'js',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: [ 'jest-rdf' ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/mocks/',
    'index.js',
    '/engines/query-sparql/test/util.ts',
    '/test/util/',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
