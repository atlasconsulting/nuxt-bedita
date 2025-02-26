export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      projects: ['project_1', 'project_2'], // in .env you should configure NUXT_BEDITA_PROJECTS with these keys
    },
  },
  compatibilityDate: '2024-08-12',

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
        regExp: '^/(?!users|profiles).*$',
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
    removeLinksMember: true,
  },
});
