

module.exports.safeRequire = (moduleName) => {
  try {
    const moduleInstance = require(moduleName);
    return moduleInstance.default || moduleInstance;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw err;
  }
}

module.exports.safeMock = (...args) => {
  try {
    jest.mock(...args);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return;
    }
    throw err;
  }
}
