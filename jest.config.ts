import { Config } from 'jest';

const jestConfig: Config = {
  clearMocks: true,
  restoreMocks: true,
  preset: 'jest-preset-angular',
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jest-environment-jsdom',
};

export default jestConfig;
