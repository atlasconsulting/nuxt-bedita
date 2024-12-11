export default defineNuxtConfig({
  modules: ['../src/module'],

  runtimeConfig: {
    public: {
      projects: ['project_1', 'project_2'], // in .env you should configure NUXT_BEDITA_PROJECTS with these keys
    },
  },

  bedita: {
    apiBaseUrl: '',
    apiKey: '',
    projects: {},
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
        path: '*',
        methods: ['GET'],
      },
      {
        path: '/documents',
        methods: ['*'],
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
