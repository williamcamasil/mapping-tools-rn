/**
 * Resolve um falso warning do Jest ao usar múltiplos "await" dentro de um "test/it".
 * Aparentemente esse problema é causado pois o RN sobrescreve o objeto Promise do Node.
 * https://github.com/callstack/react-native-testing-library/issues/379#issuecomment-1133038481
 */

const nodePromise = Promise;

module.exports = r => nodePromise.resolve().then(r);
