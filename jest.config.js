module.exports = {
  preset: 'ts-jest',
  setupFiles: ['jest-canvas-mock'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.config.js',
    '!**/*.config.ts',
    '!**/config.ts',
    '!**/startup.js',
    '!**/*.eslintrc.js',
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^[@|~]/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: [
    '<rootDir>/.nuxt',
    '<rootDir>/cypress',
    '<rootDir>/coverage',
    '<rootDir>/plugins',
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
