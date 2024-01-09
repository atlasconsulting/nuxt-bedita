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
    hideBadge?: boolean,
    useRecaptchaNet?: boolean,
  },
  resetPasswordPath?: string,
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
      hideBadge: false,
      useRecaptchaNet: false,
    },
    resetPasswordPath: '/reset-password',
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
      resetPasswordPath: options.resetPasswordPath,
      session: options.session,
    });
    runtimeConfig.public = defu(runtimeConfig.public || {}, {
      recaptcha: {
        enabled: options.recaptcha.enabled,
        siteKey: options.recaptcha.siteKey,
        hideBadge: options.recaptcha.hideBadge,
        useRecaptchaNet: options.recaptcha.useRecaptchaNet,
      }
    });

    const resolver = createResolver(import.meta.url);

    // Transpile runtime
    nuxt.options.build.transpile.push(
      resolver.resolve('./runtime'),
      resolver.resolve('../node_modules/tslib'), // transpile tslib used by @atlasconsulting/bedita-sdk
    );

    /*
     ****************
     * Server utils *
     ****************
     */
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

    /*
     **************
     * Server API *
     **************
     */
    // auth endpoints
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
      route: '/api/bedita/auth/reset',
      handler: resolver.resolve('./runtime/server/api/bedita/auth/reset.post'),
    });
    logger.info('API endpoint /api/bedita/auth/reset added.');
    addServerHandler({
      route: '/api/bedita/auth/change',
      handler: resolver.resolve('./runtime/server/api/bedita/auth/change.patch'),
    });
    logger.info('API endpoint /api/bedita/auth/change added.');
    addServerHandler({
      route: '/api/bedita/auth/optout',
      handler: resolver.resolve('./runtime/server/api/bedita/auth/optout.post'),
    });
    logger.info('API endpoint /api/bedita/auth/optout added.');

    // signup endpoints
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

    /*
     **************
     * Middlewares *
     **************
     */
    addRouteMiddleware({
      name: 'beditaAuth',
      path: resolver.resolve('./runtime/middleware/auth'),
      global: true,
    });

    /*
     ********************************
     * Composables and client utils *
     ********************************
     */
    addImportsDir(resolver.resolve('./runtime/utils'));
    addImportsDir(resolver.resolve('./runtime/composables'));

    /*
     *****************
     * Type template *
     *****************
     */
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
