import {builtinModules} from 'module';
import ts from 'rollup-plugin-ts';
import {fileURLToPath} from 'url';
import packageJson from './package.json';

const external = [...builtinModules, ...Object.keys(packageJson.dependencies)];
const typePath = fileURLToPath(new URL(packageJson.types, import.meta.url));

function createConfig(isEs) {
  return {
    external,
    input: 'source/index.ts',
    output: {
      file: isEs ? packageJson.module : packageJson.main,
      format: isEs ? 'es' : 'cjs',
      sourcemap: true,
    },
    plugins: [
      ts({
        hook: {
          outputPath: (path, kind) =>
            kind === 'declaration' ? typePath : path,
        },
        tsconfig: (resolvedConfig) =>
          isEs ? resolvedConfig : {...resolvedConfig, declaration: false},
      }),
    ],
  };
}

export default [createConfig(false), createConfig(true)];
