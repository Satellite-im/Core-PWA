module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    //  '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:vue/vue3-recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  rules: {
    'vue/script-setup-uses-vars': 0,
    'import/named': 0,
    'standard/no-callback-literal': 0,
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
