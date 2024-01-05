import {
  defineNuxtModule,
  addServerHandler,
  addImportsDir,
  createResolver,
  addServerImports,
  addRouteMiddleware,
  logger,
  addTypeTemplate,
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
      recaptchaEnabled: options.recaptcha.enabled,
      recaptchaSiteKey: options.recaptcha.siteKey,
    });

    const resolver = createResolver(import.meta.url);

    // Transpile runtime
    nuxt.options.build.transpile.push(
      resolver.resolve('./runtime'),
      resolver.resolve('../node_modules/tslib'), // transpile tslib used by @atlasconsulting/bedita-sdk
    );

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
    logger.info('API endpoint /api/bedita/auth/login added.');
    addServerHandler({
      route: '/api/bedita/auth/logout',
      handler: resolver.resolve('./runtime/server/api/bedita/auth/logout'),
    });
    logger.info('API endpoint /api/bedita/auth/logout added.');
    addServerHandler({
      route: '/api/bedita/signup',
      handler: resolver.resolve('./runtime/server/api/bedita/signup/signup.post'),
    });
    logger.info('API endpoint /api/bedita/signup added.');
    addServerHandler({
      route: '/api/bedita/signup/activation',
      handler: resolver.resolve('./runtime/server/api/bedita/signup/activation.post'),
    });
    logger.info('API endpoint /api/bedita/signup/activation added.');

    // middlewares
    addRouteMiddleware({
      name: 'beditaAuth',
      path: resolver.resolve('./runtime/middleware/auth'),
      global: true,
    });

    // composables and client utils
    addImportsDir(resolver.resolve('./runtime/utils'));
    addImportsDir(resolver.resolve('./runtime/composables'));

    addTypeTemplate({
      filename: 'types/nuxt-bedita.d.ts',
      getContents: () => [
        `declare module '@atlasconsulting/nuxt-bedita' {`,
        `  import('${resolver.resolve('./runtime/types')}')`,
        `  export type { UserAuth, UserDataStore, ApiResponseBodyResource, ApiResponseBodyList, SignupBeditaBody } from '${resolver.resolve('./runtime/types')}'`,
        `}`,
      ].join('\n'),
    });

    logger.success('nuxt-bedita ready');
  }
});
