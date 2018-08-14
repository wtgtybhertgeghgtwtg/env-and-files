module.exports = {
  plugins: [
    '@babel/proposal-nullish-coalescing-operator',
    '@babel/proposal-optional-chaining',
  ],
  presets: [
    [
      '@babel/env',
      {
        modules: process.env.NODE_ENV === 'test' && 'commonjs',
        targets: {node: '6'},
      },
    ],
    '@babel/flow',
  ],
};
