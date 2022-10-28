module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    // 'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    '/cypress/*',
    'package.json',
    '/linked-iridium/*',
    '/dist/*',
    '/android/*',
    '/iOS/*',
    '/src-tauri/*',
  ],
  plugins: ['jest'],
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'vue/script-setup-uses-vars': 0,
    'vue/multi-word-component-names': 0,
    'import/named': 0,
    'standard/no-callback-literal': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'require-await': 0,
    'no-empty-pattern': 0,
    'no-else-return': [
      'error',
      {
        allowElseIf: false,
      },
    ],
    'no-eval': [
      'error',
      {
        allowIndirect: true,
      },
    ],
  },
}
