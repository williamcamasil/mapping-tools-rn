const { CI, HUSKY } = process.env;

const config = {
  modulesPrefix: 'omni',
  rootPath: process.cwd(),
  isCI: Boolean(CI && CI !== 'false'),
  isHusky: Boolean(HUSKY && HUSKY === 'true'),
};

module.exports = config;
