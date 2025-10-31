export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '**/test/**/*.test.js',
    '**/test/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/docs/**',
    '!src/config/**',
    '!src/app.js',
    '!server.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};