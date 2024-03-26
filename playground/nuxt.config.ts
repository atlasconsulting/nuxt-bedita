export default defineNuxtConfig({
  modules: ['../src/module'],
  bedita: {
    apiBaseUrl: '',
    apiKey: '',
    auth: {
      unauthenticatedRedirect: '/login',
      rolesGuard: {
        '/profile': ['*'],
      },
    },
    recaptcha: {
      enabled: true,
      siteKey: '',
      secretKey: '',
      hideBadge: false,
      useRecaptchaNet: true,
    },
    session: {
      name: '',
      secret: '',
    }
  },
  devtools: { enabled: true }
})
