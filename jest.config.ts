import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // настройки для ts-jest
      }
    ]
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>'
  }),
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
};

export default config;
