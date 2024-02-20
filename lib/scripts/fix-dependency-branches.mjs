#!/usr/bin/env node

/*
 * Esse script corrige as branches das dependências omni para apontarem para a branch especificada
 * no parâmetro. Por reutilizar funções que utilizam CommonJS e ESModules, é recomendado executá-lo
 * usando a lib zx (npx zx <path-to-this-script> <branch-name>)
 */

import { $ } from 'zx/core';
import { replaceDependencyBranch } from '../utils/replace-dependency-branch.mjs';

try {
  const BRANCH = process.argv.at(-1);

  const branchRegex = /^(dev|hmg|stage|master)$/;
  branchRegex.test(BRANCH)
  
  if (!branchRegex.test(BRANCH)) {
    console.error('Branch not informed');
    process.exit(9);
  }
  
  replaceDependencyBranch(BRANCH);

  const { stdout: isPackageJsonChanged } = await $`git status package.json --porcelain`;

  if (!isPackageJsonChanged) {
    console.log('No dependency needs to be fixed');
    process.exit(0);
  }
  
  await $`yarn upgrade-app-modules`;
  
  const paths = ['package.json', 'yarn.lock', 'ios/Podfile.lock'];
  
  const status = await $`git status ${paths} --porcelain`;
  
  if (status.stdout) {
    await $`git add ${paths}`;
    await $`git commit -m "build(pipeline): Atualização das branches de dependências omni para branch de destino [skip ci]"`;
    // o push é feito pela pipeline do GitHub Actions devido à permissão de bypass
  }
} catch(error) {
  process.exit(1);
}