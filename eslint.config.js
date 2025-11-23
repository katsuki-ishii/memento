const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules', 'dist', 'package-lock.json'],
  },
  js.configs.recommended,
  prettier,
  {
    name: 'config-files',
    files: ['eslint.config.js', 'commitlint.config.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: { require: 'readonly', module: 'readonly' },
    },
  },
  {
    name: 'memento-base',
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];
