export default defineNuxtConfig({
  modules: ['../src/module'],
  bedita: {
    apiBaseUrl: '',
    apiKey: '',
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
