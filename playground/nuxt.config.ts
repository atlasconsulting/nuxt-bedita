export default defineNuxtConfig({
  modules: ['../src/module'],
  bedita: {
    apiBaseUrl: '',
    apiKey: '',
    recaptcha: {
      enabled: true,
      key: '',
      secret: '',
    },
    session: {
      name: '',
      secret: '',
    }
  },
  devtools: { enabled: true }
})
