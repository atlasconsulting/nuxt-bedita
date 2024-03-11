import {
  defineNuxtModule,
  addServerHandler,
  addImportsDir,
  createResolver,
  addServerImports,
  addRouteMiddleware,
  logger,
  addTypeTemplate,
  addImports,
} from '@nuxt/kit';
import { type NitroEventHandler } from 'nitropack';
import { defu } from 'defu';
import type { EndpointConf, ProxyEndpointConf } from './runtime/types';

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiBaseUrl: string,
  apiKey: string,
  auth: {
    global?: boolean,
    required?: boolean,
    unauthenticatedRedirect?: string,
    publicRoutes?: string[],
    rolesGuard?: Record<string, string[]>,
  },
  endpoints?: EndpointConf[],
  proxyEndpoints?: ProxyEndpointConf[],
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
    auth: {
      global: true,
      required: false,
      publicRoutes: [],
      unauthenticatedRedirect: '/sign-in',
      rolesGuard: {},
    },
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
    logger.start('Setting up nuxt-bedita...');

    options.auth.publicRoutes?.push(options.auth.unauthenticatedRedirect as string);

    const runtimeConfig = nuxt.options.runtimeConfig
    runtimeConfig.bedita = defu(runtimeConfig.bedita || {}, {
      apiBaseUrl: options.apiBaseUrl,
      apiKey: options.apiKey,
      proxyEndpoints: options.proxyEndpoints || [ { path: '*', methods: ['GET'] } ],
      recaptchaSecretKey: options.recaptcha.secretKey,
      resetPasswordPath: options.resetPasswordPath,
      session: options.session,
    });
    runtimeConfig.public = defu(runtimeConfig.public || {}, {
      bedita: {
        auth: {
          unauthenticatedRedirect: options.auth.unauthenticatedRedirect,
          required: options.auth.required,
          publicRoutes: options.auth.publicRoutes,
          rolesGuard: options.auth.rolesGuard,
        },
      },
      recaptcha: {
        enabled: options.recaptcha.enabled,
        siteKey: options.recaptcha.siteKey,
        hideBadge: options.recaptcha.hideBadge,
        useRecaptchaNet: options.recaptcha.useRecaptchaNet,
      }
    });

    logger.info(`Recaptcha ${options.recaptcha.enabled ? 'enabled' : 'disabled'}`);

    const resolver = createResolver(import.meta.url);

    // Transpile runtime
    nuxt.options.build.transpile.push(
      resolver.resolve('./runtime'),
      resolver.resolve('../node_modules/tslib'), // transpile tslib used by @atlasconsulting/bedita-sdk
    );

    // default endpoints
    const endpoints: EndpointConf[] = options?.endpoints || ['auth', 'signup'];

    /*
     ****************
     * Server utils *
     ****************
     */
    // addServerImportsDir(resolver.resolve('./runtime/server/utils'));
    addServerImports([
      {
        from: resolver.resolve('./runtime/server/utils/bedita-api-client'),
        name: 'beditaApiClient',
      },
      {
        from: resolver.resolve('./runtime/server/utils/bedita-api-client'),
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
      {
        from: resolver.resolve('./runtime/utils/user-data-store'),
        name: 'filterUserDataToStore',
      },
    ]);

    /*
     **************
     * Server API *
     **************
     */
    const endpointsEnabled: NitroEventHandler[] = [];
    // auth endpoints
    if (endpoints.includes('auth')) {
      endpointsEnabled.push(
        {
          route: '/api/bedita/auth',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/login.post'),
        },
        {
          route: '/api/bedita/auth/user',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/user.patch'),
        },
        {
          route: '/api/bedita/auth/logout',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/logout'),
        },
        {
          route: '/api/bedita/auth/reset',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/reset.post'),
        },
        {
          route: '/api/bedita/auth/change',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/change.patch'),
        },
        {
          route: '/api/bedita/auth/optout',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/optout.post'),
        }
      );
    }

    // signup endpoints
    if (endpoints.includes('signup')) {
      endpointsEnabled.push(
        {
          route: '/api/bedita/signup',
          handler: resolver.resolve('./runtime/server/api/bedita/signup/signup.post'),
        },
        {
          route: '/api/bedita/signup/activation',
          handler: resolver.resolve('./runtime/server/api/bedita/signup/activation.post'),
        },
      );
    }

    // BEdita API proxy
    endpointsEnabled.push(
      {
        route: '/api/bedita/**',
        handler: resolver.resolve('./runtime/server/api/bedita/api-proxy.get'),
      }
    );

    endpointsEnabled.forEach((endpoint) => {
      addServerHandler(endpoint);
      const methodMatch = endpoint.handler.match(/\.(get|post|patch|delete)/);
      const method = methodMatch ? `${methodMatch[1].toUpperCase()} ` : '';
      logger.info(`API endpoint ${method}${endpoint.route} added.`);
    });

    /*
     ***************
     * Middlewares *
     ***************
     */
    addRouteMiddleware({
      name: 'beditaAuth',
      path: resolver.resolve('./runtime/middleware/auth'),
      global: options.auth.global,
    });

    /*
     ********************************
     * Composables and SSR utils    *
     ********************************
     */
    addImportsDir(resolver.resolve('./runtime/utils'));
    addImportsDir(resolver.resolve('./runtime/composables'));
    // imports to use for example in route middlewares (server side)
    addImports([
      {
        from: resolver.resolve('./runtime/server/utils/session'),
        name: 'getSessionConfig',
      },
      {
        from: resolver.resolve('./runtime/server/utils/bedita-api-client'),
        name: 'beditaApiClient',
      },
    ]);

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
