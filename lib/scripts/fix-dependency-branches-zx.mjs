#!/usr/bin/env zx

/*
 * Esse script executa o script fix-dependency-branches.mjs usando a lib zx.
 * Quem o executa precisa ter o mapping-tools-rn instalado como dependência.
 * É exportado como bin e utilizado no contexto de CI do GitHub actions.
 */

import { $ } from 'zx/core';

const BRANCH = process.argv.at(-1);

try {
  await $`npx zx node_modules/mapping-tools-rn/lib/scripts/fix-dependency-branches.mjs ${BRANCH}`
} catch(err) {
  console.error(err);
  process.exit(1);
}

