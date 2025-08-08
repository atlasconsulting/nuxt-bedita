# BEdita Nuxt module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for [BEdita API](https://github.com/bedita/bedita).

<!-- - [✨ &nbsp;Release Notes](/CHANGELOG.md) -->
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@atlasconsulting/nuxt-bedita?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- Nuxt 3 and Nuxt 4 ready
- Easy integration with [BEdita API](https://github.com/bedita/bedita)
- expose API for login, logout, signup
- Auto import composables `useBeditaAuth`, `useBeditaSignup`, `useBeditaRecaptcha` (only [v3](https://developers.google.com/recaptcha/docs/v3) version is supported)
- Auto import server utils

## Quick Setup

1. Add `@atlasconsulting/nuxt-bedita` dependency to your project

```bash
# Using pnpm
pnpm add -D @atlasconsulting/nuxt-bedita

# Using yarn
yarn add --dev @atlasconsulting/nuxt-bedita

# Using npm
npm install --save-dev @atlasconsulting/nuxt-bedita
```

2. Add `@atlasconsulting/nuxt-bedita` to the `modules` section of `nuxt.config.ts`.

```js
export default defineNuxtConfig({
  modules: [
    '@atlasconsulting/nuxt-bedita'
  ],
  bedita: {
    apiBaseUrl: 'https://api-bedita.mydomain.com', // required
    apiKey: '<bedita-api-key>', // required
    auth: { // optional
      global: true, // install beditaAuth as global middleware or not
      required: false, // require user authenticated for every routes
      publicRoutes: [], // public routes, no authentication is required
      unauthenticatedRedirect: '/sign-in', // unauthenticated redirect route
      rolesGuard: {}, // roles guard (based on BEdita user's roles)
    },
    endpoints: ['auth', 'signup'], // API endpoints added to app
    proxyEndpoints: [], // endpoints proxied to BEdita API as is (by default all GET requests are proxied)
    recaptcha: {
      enabled: true, // default true
      siteKey: '<recaptcha-site-key>', // required if recaptcha is enabled
      secretKey: '<recaptcha-secret-key>', // required if recaptcha is enabled
      hideBadge: false, // default false, hide Recaptcha badge (https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed)
      useRecaptchaNet: true, // default true, allow to use the domain `recaptcha.net` instead of `google.com`
    },
    replaceTranslations: true, // replace main objects languages using `lang` query string
    resetPasswordPath: '/reset-password', // route path to page used for password reset. Sent via email to user in the forgotten password flow.
    session: {
      name: 'bedita', // session cookie name
      secret: '<session-secret>', // required private key used to encrypt session
    }, 
  }
})
```
> See [documentation](https://atlasconsulting.github.io/nuxt-bedita/getting-started/configuration) for more details. 

That's it! You can now use BEdita Nuxt module in your Nuxt app ✨

## Usage

See [documentation](https://atlasconsulting.github.io/nuxt-bedita).

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@atlasconsulting/nuxt-bedita/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@atlasconsulting/nuxt-bedita

[npm-downloads-src]: https://img.shields.io/npm/dm/@atlasconsulting/nuxt-bedita.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@atlasconsulting/nuxt-bedita

[license-src]: https://img.shields.io/npm/l/@atlasconsulting/nuxt-bedita.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@atlasconsulting/nuxt-bedita

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
