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
      {
        path: '/files',
        methods: ['GET'],
      },
      {
        path: '/files/upload',
        methods: ['POST'],
      },
    ],
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-08-12',
});
