import {
  defineNuxtModule,
  addServerHandler,
  addImportsDir,
  createResolver,
  addServerImports,
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
    siteKey?: string,
    secretKey?: string,
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
    logger.info('Setting up nuxt-bedita...');

    const runtimeConfig = nuxt.options.runtimeConfig
    runtimeConfig.bedita = defu(runtimeConfig.bedita || {}, {
      apiBaseUrl: options.apiBaseUrl,
      apiKey: options.apiKey,
      recaptchaSecretKey: options.recaptcha.secretKey,
      session: options.session,
    });
    runtimeConfig.public = defu(runtimeConfig.public, {
      recaptchaSiteKey: options.recaptcha.siteKey,
    });

    const resolver = createResolver(import.meta.url);

    // Transpile runtime
    nuxt.options.build.transpile.push(resolver.resolve('./runtime'));

    // Server utils
    // addServerImportsDir(resolver.resolve('./runtime/server/utils'));
    addServerImports([
      {
        from: resolver.resolve('./runtime/server/utils/bedita-client'),
        name: 'beditaClient',
      },
      {
        from: resolver.resolve('./runtime/server/utils/bedita-client'),
        name: 'handleBeditaApiError',
      },
      {
        from: resolver.resolve('./runtime/server/utils/recaptcha'),
        name: 'recaptchaVerifyToken',
      },
      {
        from: resolver.resolve('./runtime/server/utils/session'),
        name: 'getSessionConfig',
      },
    ]);

    // Server API
    addServerHandler({
      route: '/api/bedita/auth/login',
      handler: resolver.resolve('./runtime/server/api/bedita/auth/login.post'),
    });
    addServerHandler({
      route: '/api/bedita/auth/logout',
      handler: resolver.resolve('./runtime/server/api/bedita/auth/logout.get'),
    });

    // // middlewares
    addRouteMiddleware({
      name: 'beditaAuth',
      path: resolver.resolve('./runtime/middleware/auth'),
      global: true,
    });

    // composables and client utils
    addImportsDir(resolver.resolve('./runtime/utils'));
    addImportsDir(resolver.resolve('./runtime/composables'));

    logger.success('nuxt-bedita ready');
  }
});
