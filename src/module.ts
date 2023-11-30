import {
  defineNuxtModule,
  addPlugin,
  addServerHandler,
  addImportsDir,
  createResolver,
  addServerImportsDir,
  addRouteMiddleware,
  logger,
} from '@nuxt/kit';
import { defu } from 'defu';

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiBaseUrl: string,
  apiKey: string,
  recaptcha: {
    enabled: boolean,
    key?: string,
    secret?: string,
  },
  session: {
    name: string,
    secret: string,
  },
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@atlasconsulting/nuxt-bedita',
    configKey: 'bedita',
    compatibility: {
      nuxt: '^3.0.0'
    },
  },

  // Default configuration options of the Nuxt module
  defaults: {
    apiBaseUrl: '',
    apiKey: '',
    recaptcha: {
      enabled: false,
    },
    session: {
      name: 'bedita',
      secret: '',
    },
  },

  setup (options, nuxt) {
    logger.info('Setting up bedita-nuxt...');

    const runtimeConfig = nuxt.options.runtimeConfig
    runtimeConfig.bedita = defu(runtimeConfig.bedita || {}, {
      apiBaseUrl: options.apiBaseUrl,
      apiKey: options.apiKey,
      recaptchaSecret: options.recaptcha.secret,
      session: options.session,
    });
    runtimeConfig.public = defu(runtimeConfig.public, {
      recaptchaKey: options.recaptcha.key,
    });

    const resolver = createResolver(import.meta.url);

    // Transpile runtime
    nuxt.options.build.transpile.push(resolver.resolve('./runtime'));

    // Server utils
    addServerImportsDir(resolver.resolve('./runtime/server/utils'));

    // Server API
    const baseApiPath = './runtime/server/api/bedita';
    addServerHandler({
      route: '/api/bedita/auth/login',
      handler: resolver.resolve(`${baseApiPath}/auth/login.post.ts`),
    });
    addServerHandler({
      route: '/api/bedita/auth/logout',
      handler: resolver.resolve(`${baseApiPath}/auth/logout.get.ts`),
    });

    // middlewares
    addRouteMiddleware({
      name: 'beditaAuth',
      path: resolver.resolve('./runtime/middleware/auth.ts'),
      global: true,
    });

    // composables and client utils
    addImportsDir(resolver.resolve('./runtime/utils'));
    addImportsDir(resolver.resolve('./runtime/composables'));

    // plugins
    addPlugin(resolver.resolve('./runtime/plugins/recaptcha'));
  }
})
