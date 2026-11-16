import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/coverage/**']),

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'app/rules',
    rules: {
      'vue/multi-word-component-names': 'off',
      // Optional TS props are `undefined` by default — no need to spell it out.
      'vue/require-default-prop': 'off',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/define-macros-order': [
        'error',
        { order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'] },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Feature-Sliced Design: other slices are reachable only through their public API (index.ts).
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/app/*',
                '@/pages/*/*',
                '@/widgets/*/*',
                '@/features/*/*',
                '@/entities/*/*',
                '@/blocks/*/*',
                '@/shared/*/*',
              ],
              message:
                'Import other slices through their public API (index.ts), not their internals.',
            },
          ],
        },
      ],
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/*.spec.ts'],
    rules: {
      ...pluginVitest.configs.recommended.rules,
      // Tests define small throwaway components inline.
      'vue/one-component-per-file': 'off',
    },
  },

  skipFormatting,
)
