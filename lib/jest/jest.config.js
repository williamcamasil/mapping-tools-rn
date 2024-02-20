const path = require('path');
const fs = require('fs');
const jestConfig = require('jest-config');

const config = require('../utils/config');
const isLibrary = require('../utils/is-library');

const coverageThreshold = config.isCI || config.isHusky
  ? {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  }
  : jestConfig.defaults.coverageThreshold;

const cacheDirectory = config.isCI
  ? path.resolve(config.rootPath, 'jest_cache')
  : jestConfig.defaults.cacheDirectory;

const defaultJestSetupPath = path.resolve(__dirname, 'jest.setup.js');
const svgMockPath = path.resolve(__dirname, 'svgMock.js');
const asapPath = path.resolve(__dirname, 'asap.js');

const nodeModulesTransformIgnorePatterns = [
  'react-native',
  '@react-native',
  'omni-.*',
  '.*-omni',
  '@react-navigation',
];

const setupFiles = [
  defaultJestSetupPath,
];

const gestureHandlePathPath = path.resolve(config.rootPath, 'node_modules/react-native-gesture-handler/jestSetup.js');
if (fs.existsSync(gestureHandlePathPath)) {
  setupFiles.push(gestureHandlePathPath);
}

const rootJestSetupPath = path.resolve(config.rootPath, 'jest.setup.js');
if (fs.existsSync(rootJestSetupPath)) {
  setupFiles.push(rootJestSetupPath);
}

const rootDirectory = isLibrary() ? 'lib' : 'src';

const collectCoverageFrom = [
  `${rootDirectory}/**/*.ts?(x)`,
  `!${rootDirectory}/index.ts?(x)`,
  `!${rootDirectory}/**/test-utils.ts?(x)`,
  `!${rootDirectory}/**/*.stories.tsx`,
  `!${rootDirectory}/**/assets/**/*.*`,
  `!${rootDirectory}/@types/**/*.*`,
  `!${rootDirectory}/**/navigation/**/*.ts?(x)`,
  `!${rootDirectory}/Mock*/**/*.*`,
  `!${rootDirectory}/Mock*.ts?(x)`,
];

module.exports = {
  cacheDirectory,
  ... (!config.isCI ? {
    maxWorkers: '50%', // https://dev.to/vantanev/make-your-jest-tests-up-to-20-faster-by-changing-a-single-setting-i36
    maxConcurrency: 2,
  } : {}),
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!' + nodeModulesTransformIgnorePatterns.join('|') + ')',
  ],
  setupFiles: setupFiles,
  moduleNameMapper: {
    '\\.svg': svgMockPath,
    '^asap$': asapPath,
    '^asap/raw$': asapPath,
  },
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  workerIdleMemoryLimit: '500MB',
  testTimeout: 20000,
  collectCoverageFrom,
  coverageThreshold,
};
