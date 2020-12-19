module.exports = {
  plugins: ['@babel/proposal-nullish-coalescing-operator'],
  presets: [
    [
      '@babel/env',
      {
        modules: process.env.NODE_ENV === 'test' && 'commonjs',
        targets: {node: '12'},
      },
    ],
    '@babel/typescript',
  ],
};
