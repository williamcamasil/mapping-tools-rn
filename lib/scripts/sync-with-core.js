#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const packageJson = require('../utils/read-package-json');
const config = require('../utils/config');

class SyncError extends Error {
  constructor(message) {
    super(message);
  }
}

const FATAL_ERROR = new SyncError(
  'Não foi possível conectar, certifique-se de que o metro está em execução no "core" e escutando na porta 8081.',
);

function ensureDirectoryExistence(dirPath) {
  const dirname = path.dirname(dirPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function resumeFilePath(filePath) {
  return filePath.replace(config.rootPath, '');
}

function startSync(corePath) {
  const linkedModulePath = path.resolve(
    corePath,
    'node_modules',
    packageJson.name,
  );

  function getLinkedFilePath(originalPath) {
    return originalPath.replace(config.rootPath, linkedModulePath);
  }

  function copyAddedOrChangedFile(originalPath) {
    const tempUpdatedPath = getLinkedFilePath(originalPath);
    ensureDirectoryExistence(tempUpdatedPath);
    fs.copyFileSync(originalPath, tempUpdatedPath);
  }

  function unlinkDeletedFile(originalPath) {
    const tempUpdatedPath = getLinkedFilePath(originalPath);
    fs.unlinkSync(tempUpdatedPath);
  }

  const watcher = chokidar.watch(config.rootPath, {
    // ignore dotfiles, nome_modules, android and ios folders
    ignored: /((^|[/\\])\..|__tests__|node_modules|android\/(build|app\/build)|ios\/build)/,
    ignoreInitial: false,
    awaitWriteFinish: {
      pollInterval: 500,
      stabilityThreshold: 500,
    },
  });

  watcher
    .on('add', originalPath => {
      console.log('\x1b[34m', `Added file: ${resumeFilePath(originalPath)}`, '\x1b[0m');
      copyAddedOrChangedFile(originalPath);
    })
    .on('change', originalPath => {
      console.log('\x1b[32m', `Changed file: ${resumeFilePath(originalPath)}`, '\x1b[0m');
      copyAddedOrChangedFile(originalPath);
    })
    .on('unlink', originalPath => {
      console.log('\x1b[35m', `Removed file: ${resumeFilePath(originalPath)}`, '\x1b[0m');
      unlinkDeletedFile(originalPath);
    });
}

async function syncWithCore() {
  try {
    const response = await fetch(
      'http://localhost:8081/sync-local-module?' +
      new URLSearchParams({
        name: packageJson.name,
      }),
    );

    if (response.status === 404) {
      throw new SyncError(
        'Módulo ' + packageJson.name + ' não está instalado no projeto "core".',
      );
    }

    if (response.status !== 200) {
      throw FATAL_ERROR;
    }

    const corePath = await response.text();

    startSync(corePath);
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      throw FATAL_ERROR;
    }
    throw err;
  }
}

(async () => {
  try {
    await syncWithCore();
  } catch (err) {
    if (err instanceof SyncError) {
      console.error('Erro: ' + err.message);
      return;
    }
    console.error(err);
  }
})();
