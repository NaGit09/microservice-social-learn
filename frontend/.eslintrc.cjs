module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/prettier',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
