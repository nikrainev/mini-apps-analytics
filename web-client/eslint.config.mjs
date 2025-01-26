import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next', 'eslint-config-next'],
        settings: {
            next: {
                rootDir: 'web-client',
            },
        },
        'rules': {
            'react/prop-types': 0,
            'indent': [
                'error',
                4,
                {
                    'SwitchCase': 1,
                    'ignoredNodes': ['TemplateLiteral']
                }
            ],
            'import/no-extraneous-dependencies': [
                'error', {
                    'devDependencies': true
                }
            ],
            'operator-linebreak': [
                'error',
                'after',
                {
                    'overrides': {
                        '?': 'before',
                        ':': 'before'
                    }
                }
            ],
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
            'react/jsx-props-no-spreading': ['warn'],
            'implicit-arrow-linebreak': 0,
            'max-len': ['warn', { 'code': 120 }],
            'no-plusplus': 0,
            'no-underscore-dangle': 0,
            'import/prefer-default-export': 0,
            'template-curly-spacing': 0,
            'array-callback-return': 0,
            'jsx-a11y/media-has-caption': 0,
            'quotes': ['error', 'single'],
            'object-curly-spacing': ['error', 'always'],
            'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 0 }],
            'semi': ['error', 'always'],
            'import/order': ['error', {
                'groups': ['builtin', 'external', 'internal'],
                'pathGroups': [
                    {
                        'pattern': 'react',
                        'group': 'external',
                        'position': 'before'
                    }
                ],
                'pathGroupsExcludedImportTypes': ['react'],
                'newlines-between': 'always',
                'alphabetize': {
                    'order': 'asc',
                    'caseInsensitive': true
                }
            }]
        }
    }),
];

export default eslintConfig;
