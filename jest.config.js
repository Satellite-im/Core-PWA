// set timezone to UTC for consistent timestamp tests
process.env.TZ = 'UTC'

module.exports = {
  preset: 'ts-jest',
  setupFiles: [
    'jest-canvas-mock',
    'dotenv/config',
    './jest-setup.js',
    'jsdom-worker',
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.config.js',
    '!**/*.config.ts',
    '!**/config.ts',
    '!**/startup.js',
    '!**/*.eslintrc.js',
    '!**/iridium/**',
    '!**/*.disabled.ts',
    '!**/linked-iridium/**',
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^[@|~]/(.*)$': '<rootDir>/$1',
    skaler: '<rootDir>/store/__mocks__/skaler.js',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/linked-iridium',
    '<rootDir>/iridium',
    '<rootDir>/cypress',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/.nuxt',
    '<rootDir>/cypress',
    '<rootDir>/coverage',
    '<rootDir>/plugins',
    '<rootDir>/electron',
    '<rootDir>/libraries/Enums',
    '<rootDir>/libraries/Files/errors',
    '<rootDir>/libraries/Files/types',
    '<rootDir>/types',
    '<rootDir>/iridium',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    'node_modules/(?!@mylibrary/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}
