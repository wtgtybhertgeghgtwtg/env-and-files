import builtinModules from 'builtin-modules';
import babel from 'rollup-plugin-babel';
import pkg from '../../package.json';

export default {
  external: [...builtinModules, ...Object.keys(pkg.dependencies)],
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [babel()],
};
