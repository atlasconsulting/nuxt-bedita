// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: {
      semi: true,
      braceStyle: '1tbs',
    },
  },
  dirs: {
    src: [
      './playground',
    ],
  },
})
  .append(
    // your custom flat config here...
    {
      rules: {
        'vue/max-attributes-per-line': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  );
