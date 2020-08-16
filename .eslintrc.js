module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['airbnb', 'airbnb/hooks', 'prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['prettier', 'react', '@typescript-eslint'],
    rules: {
        // Allows eslint to be formatted and validated with prettier
        'prettier/prettier': 'error',
        // Not needed w/our build process
        'import/no-unresolved': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
        // implicit-arrow-linebreak disabled because it collides with 80 character
        // line length rule. Also when enabled, one attempted workaround
        // is to add curly braces after a fat arrow declaration, but if
        // the implementation immediately returns a value, then arrow-body-style
        // is raised as an error
        'implicit-arrow-linebreak': 'off',
        // Not needed. We will let client side P4 tooling take care of
        // converting line endings
        'linebreak-style': 'off',
        // Prefer no space before function paren
        'space-before-function-paren': 'off',
        // Hoisting is ok
        'no-use-before-define': 'off',
        'no-console': 'off',
        // TypeScript interfaces / types for props replaces this
        'react/prop-types': 'off',
        // Prettier is used for indentation
        indent: 'off',
        /** Too restrictive */
        'react/jsx-props-no-spreading': 'off',
        // This collides with Prettier auto-reformatting rule
        'no-confusing-arrow': 'off',
        // Causes a lot of exceptions to be added in code potentially
        // due to 3rd party / data model dependencies
        camelcase: 'off',
        // This collides with auto-reformatting
        'operator-linebreak': 'off',
        // Set to off since there are too many conflicts with code re-foramtting
        'object-curly-newline': 'off',
        // This collides with auto-reformatting
        'function-paren-newline': 'off',
        // This collides with auto-reformatting
        'react/jsx-curly-newline': 'off',
        // This collides with auto-reformatting
        'react/jsx-one-expression-per-line': 'off',
        // Prettier is responsible for indentation
        'react/jsx-indent': 'off',
        // Prettier is responsible for indentation
        'react/jsx-indent-props': 'off',
        'react/jsx-wrap-multilines': ['error', { declaration: false, assignment: false }],
        // A few things have been brought in to help with linting errors of meta
        // model UI code. TODO: Make consistent at some point and remove these
        // exceptions
        'react/static-property-placement': 'off',
        'import/prefer-default-export': 'off',
        'no-param-reassign': 'off',
        'no-useless-constructor': 'off',
        'no-empty-function': 'off',
        'class-methods-use-this': 'off',
        'no-template-curly-in-string': 'off',
        'max-params': ['error', 5],
        'max-len': 'off',
        // Ensure curly braces rule is enabled for all blocks
        curly: ['error', 'all'],
        // Some devDependencies are imported in some test files, hence disable devDependencies check
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: true, optionalDependencies: true, peerDependencies: false },
        ],
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.test.ts', '*.test.tsx'],
            excludedFiles: 'node/modules/**/*',
            rules: {
                'no-unused-vars': ['off'],
            },
        },
    ],
};
