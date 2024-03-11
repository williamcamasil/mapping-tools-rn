#!/usr/bin/env node
const fs = require('fs');
const config = require('mapping-tools-rn/lib/utils/config');
const path = require('path');

const packageJsonPath = path.resolve(config.rootPath, 'package.json');

/**
 *
 * @param {string} dependency
 * @returns {string}
 */
function hasInternalModulePrefix(dependency) {
  return dependency.includes(`-${config.modulesPrefix}`) || dependency.includes(`${config.modulesPrefix}-`);
}

/**
 *
 * @param {string} version
 * @param {string} branch
 * @returns {string}
 */
function replaceBranch(version, branch) {
  return version.replace(/#[\d\w\-_]+$/i, `#${branch}`);
}

/**
 *
 * @param {object} dependencies
 * @param {string} branch
 * @returns {object}
 */
function replaceBranchInDependencyVersion(dependencies, branch) {
  if (!dependencies) return undefined;

  return Object.keys(dependencies)
    .reduce((acc, dependency) => {
      const version = dependencies[dependency];

      return {
        ...acc,
        [dependency]: hasInternalModulePrefix(dependency)
          ? replaceBranch(version, branch)
          : version,
      };
    }, {});
}

/**
 *
 * @param {string} branch
 */
export function replaceDependencyBranch(branch) {
  // eslint-disable-next-line import/no-dynamic-require
  const packageJson = require(packageJsonPath);

  packageJson.dependencies = replaceBranchInDependencyVersion(packageJson.dependencies, branch);
  packageJson.devDependencies = replaceBranchInDependencyVersion(packageJson.devDependencies, branch);

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, {
    encoding: 'utf-8',
  });
}
