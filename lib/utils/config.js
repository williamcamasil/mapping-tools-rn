const { CI, HUSKY } = process.env;

const config = {
  modulesPrefix: 'mapping',
  rootPath: process.cwd(),
  isCI: Boolean(CI && CI !== 'false'),
  isHusky: Boolean(HUSKY && HUSKY === 'true'),
};

module.exports = config;
