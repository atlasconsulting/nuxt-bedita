import { fileURLToPath } from 'node:url';
import { loadNuxt } from '@nuxt/kit';
import { describe, expect, it } from 'vitest';

const rootDir = fileURLToPath(new URL('./fixtures/basic', import.meta.url));

describe('module configuration', () => {
  it('applies session and authentication defaults to runtime config', async () => {
    const nuxt = await loadNuxt({ cwd: rootDir, dev: false });
    try {
      expect(nuxt.options.runtimeConfig.bedita.session).toEqual({
        name: 'bedita',
        secret: '',
        maxAge: undefined,
        cookie: { sameSite: 'lax' },
      });
      expect(nuxt.options.runtimeConfig.public.bedita.auth).toMatchObject({
        required: false,
        unauthenticatedRedirect: '/sign-in',
        publicRoutes: ['/sign-in'],
      });
    } finally {
      await nuxt.close();
    }
  });

  it('merges module options and runtime overrides without exposing secrets', async () => {
    const nuxt = await loadNuxt({
      cwd: rootDir,
      dev: false,
      overrides: {
        bedita: {
          apiBaseUrl: 'https://api.example.test',
          apiKey: 'module-api-key',
          auth: {
            required: true,
            unauthenticatedRedirect: '/login',
            publicRoutes: ['/public'],
          },
          session: {
            name: 'custom-session',
            secret: 'module-session-secret',
            maxAge: 3600,
            cookie: { sameSite: 'strict' },
          },
        },
        runtimeConfig: {
          bedita: {
            apiKey: 'runtime-api-key',
            session: { secret: 'runtime-session-secret' },
          },
        },
      },
    });
    try {
      const { bedita, public: publicConfig } = nuxt.options.runtimeConfig;
      expect(bedita).toMatchObject({
        apiBaseUrl: 'https://api.example.test',
        apiKey: 'runtime-api-key',
        session: {
          name: 'custom-session',
          secret: 'runtime-session-secret',
          maxAge: 3600,
          cookie: { sameSite: 'strict' },
        },
      });
      expect(publicConfig.bedita.auth).toMatchObject({
        required: true,
        unauthenticatedRedirect: '/login',
        publicRoutes: ['/public', '/login'],
      });
      expect(publicConfig.bedita).not.toHaveProperty('apiKey');
      expect(publicConfig.bedita).not.toHaveProperty('session');
    } finally {
      await nuxt.close();
    }
  });
});
