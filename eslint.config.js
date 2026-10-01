import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    'dist',
    'dev-dist',
    'coverage',
    'playwright-report',
    'test-results',
    'supabase/.temp',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
  },
  {
    // Componentes de UI e rotas exportam variantes e configs junto dos componentes.
    files: ['src/components/ui/**/*.tsx', 'src/app/router.tsx', 'src/test/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
