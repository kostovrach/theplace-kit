// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from '@vue/eslint-config-prettier';

export default withNuxt([
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/.nuxt/**',
            '**/coverage/**',
            '**/scripts/**',
        ],
        files: ['**/*.{ts,js,mjs,vue}'],
        languageOptions: {
            parserOptions: {
                extraFileExtensions: ['.vue'],
                projectService: true,
            },
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'vue/no-v-html': 'off',
        },
    },
    // ...prettier,
]);
