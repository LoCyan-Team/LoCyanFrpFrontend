// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "always",
      }
    }]
  }
})