const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const vue = require('eslint-plugin-vue');

const vueConfigs = vue.configs['flat/recommended'].map((config) => ({
  ...config,
  files: ['frontend/**/*.{vue,js,jsx,ts,tsx,mjs,cjs}'],
  languageOptions: {
    ...(config.languageOptions ?? {}),
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    ...(config.rules ?? {}),
    'vue/multi-word-component-names': 'off',
  },
}));

module.exports = [
  {
    ignores: [
      'node_modules',
      'dist',
      'package-lock.json',
      'frontend/node_modules',
      'frontend/dist',
    ],
  },
  js.configs.recommended,
  ...vueConfigs,
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
  {
    name: 'backend-node',
    files: ['backend/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        URL: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];
