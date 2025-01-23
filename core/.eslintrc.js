module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'indent': [
      'error',
      4,
      {
        'SwitchCase': 1,
        'MemberExpression': 1,
        'ignoredNodes': [
          'FunctionExpression > .params[decorators.length > 0]',
          'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
          'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
        ],
      },
    ],
    'implicit-arrow-linebreak': 0,
    'max-len': ['warn', { 'code': 120 }],
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'template-curly-spacing': 0,
    'array-callback-return': 0,
    'quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 0 }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-newline': ['error', { multiline: true, minProperties: 4, consistent: true }],
  },
};
