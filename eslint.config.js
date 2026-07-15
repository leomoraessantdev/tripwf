import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Padrão do template Vite: ignora "unused" que começa com maiúscula —
      // componentes usados só em JSX não contam como uso pro eslint core.
      // ignoreRestSiblings: permite `const { propIgnorada, ...resto } = props`
      // (padrão usado em Imagem.jsx pra descartar prop de compat).
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', ignoreRestSiblings: true }],
      // O app usa setState-em-effect de propósito em modais/imagens
      // (sincronizar estado com rota/sessionStorage). Regra nova do plugin
      // v7 voltada ao React Compiler — informativa demais pra virar erro aqui.
      'react-hooks/set-state-in-effect': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    }
  }
]
