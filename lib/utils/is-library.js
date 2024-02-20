const path = require('path');
const fs = require('fs');

const config = require('./config');

const isLibrary = () => {
  const libraryPath = path.resolve(config.rootPath, 'lib');

  return fs.existsSync(libraryPath);
}

module.exports = isLibrary;
