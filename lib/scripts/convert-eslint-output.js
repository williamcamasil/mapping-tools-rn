#!/usr/bin/env node

/*
 * Esse script converte os `filePath` do relatório gerado pelo ESLINT, de caminhos absolutos
 * para caminhos relativos.
 *
 * Isso é necessário, pois o Sonar Scanner precisa ler esses arquivos no momento de upload dos
 * dados para o servidor, e como o Sonar Scanner roda dentro de um container Docker, esse caminho
 * absoluto não existe dentro do conatiner.
 */

const fs = require('fs');
const path = require('path');

const config = require('../utils/config');

const eslintOriginalOutputFilePath = path.resolve(config.rootPath, 'coverage', 'eslint.json');
const eslintRelativeOutputFilePath = path.resolve(config.rootPath, 'coverage', 'eslint-relative.json');

function convertToRelativePath(absolutePath) {
  const relativePath = absolutePath.replace(config.rootPath, '.');
  return relativePath;
}

function convertEslintOutput() {
  if (!fs.existsSync(eslintOriginalOutputFilePath)) {
    return;
  }

  const eslintOriginalOutput = require(eslintOriginalOutputFilePath);

  const eslintRelativeOutput = eslintOriginalOutput.map(registry => ({
    ...registry,
    filePath: convertToRelativePath(registry.filePath),
  }));

  fs.writeFileSync(
    eslintRelativeOutputFilePath,
    JSON.stringify(eslintRelativeOutput),
    'utf8',
  );
}

convertEslintOutput();
