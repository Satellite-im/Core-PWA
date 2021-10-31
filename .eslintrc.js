export default {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'vue/script-setup-uses-vars': 0,
    'import/named': 0,
    'standard/no-callback-literal': 0,
  },
}
