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
      sessionUserProps: ['created', 'description'],
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
    },
    proxyEndpoints: [
      {
        path: '/documents',
        methods: ['*'],
      },
    ],
  },
  devtools: { enabled: true }
})
