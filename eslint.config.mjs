import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default [
  {
    files: ["src/**/*.{js,mjs,cjs,ts,tsx}"]
  },
  {
    ignores: [
      'eslint.config.mjs',
      'dist/',
      'vite-env.d.ts'
    ]
  },
  {
    languageOptions: { 
      globals: globals.node,
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.node.json', 'tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      '@stylistic/ts': stylisticTs
    },
    rules: {
      '@stylistic/ts/indent': [
        'error',
        2
      ],
      '@stylistic/ts/quotes': [
        'error',
        'single'
      ],
      '@stylistic/ts/semi': [
        'error',
        'always'
      ],
      '@stylistic/ts/block-spacing': [
        'error',
        'always'
      ],
      '@stylistic/ts/object-curly-spacing': [
        'error',
        'always'
      ]
    },
  }
];