#!/usr/bin/env node

const { exec } = require('child_process');

const packageJson = require('../utils/read-package-json');
const config = require('../utils/config');

function getDependenciesWithVersion(dependencies) {
  if (!dependencies) return [];
  return Object.keys(dependencies)
    .filter(packageName => packageName.startsWith(`${config.modulesPrefix}-`) || packageName.endsWith(`-${config.modulesPrefix}`))
    .map(packageName => {
      const packageVersion = dependencies[packageName];
      return `${packageName}@${packageVersion}`;
    })
    .join(' ');
}

function getDependenciesNames(dependencies) {
  if (!dependencies) return [];
  return Object.keys(dependencies)
    .filter(packageName => packageName.startsWith(`${config.modulesPrefix}-`) || packageName.endsWith(`-${config.modulesPrefix}`))
    .join(' ');
}

function updateAppModules() {
  const modulesToRemove = getDependenciesNames({
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  });
  const modulesToUpdate = getDependenciesWithVersion(packageJson.dependencies);
  const devModulesToUpdate = getDependenciesWithVersion(packageJson.devDependencies);

  if (!modulesToRemove.length) {
    console.warn('No modules were found to update.');
    process.exit(0);
  }

  /*
   * As dependências são atualizadas removendo-as e adicionando novamente, para evitar que todas as dependências de terceiro também sejam atualizadas.
   * Deste modo, algumas dependências de terceiro podem ser atualizadas, mas é um número bem menor do que se utilizar o "yarn up".
   * https://github.com/yarnpkg/yarn/issues/2394
   */

  const commands = [`yarn remove ${modulesToRemove}`];

  if (devModulesToUpdate.length) {
    commands.push(`yarn add -D ${devModulesToUpdate}`);
  }

  if (modulesToUpdate.length) {
    commands.push(`yarn add ${modulesToUpdate}`);
  }

  commands.push('yarn dedupe --strategy highest');

  const command = commands.join(' && ');

  console.log('Running:', command);

  const yarnProcess = exec(command);

  yarnProcess.stdout.pipe(process.stdout);
  yarnProcess.stderr.pipe(process.stdout);

  yarnProcess.on('exit', code => {
    process.exit(code);
  });
}

updateAppModules();
