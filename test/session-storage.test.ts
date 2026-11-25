import { describe, it, expect } from 'vitest';
import { BEditaApiClient } from '@atlasconsulting/bedita-sdk';
import type { SessionData } from 'h3';
import SessionStorageAdapter, { type SessionManager } from '../src/runtime/server/services/adapters/session-storage-adapter';
import { SESSION_STORAGE, sessionStorageKey } from '../src/runtime/server/utils/session-storage';

const fakeSession = (): SessionManager => {
  const session: SessionManager = {
    id: 'test',
    data: {} as SessionData,
    update: async () => session,
    clear: async () => session,
  };

  return session;
};

describe('session storage', () => {
  // Guards the SDK key format: the auth middleware reads the session without the SDK
  it('SDK client writes where sessionStorageKey reads', async () => {
    const session = fakeSession();
    const client = new BEditaApiClient({
      baseUrl: 'http://localhost',
      name: SESSION_STORAGE.name,
      storageAdapter: new SessionStorageAdapter(session),
    });
    client.getStorageService().setNamespaceSeparator(SESSION_STORAGE.separator);

    const user = { id: 1, username: 'tester', roles: ['admin'] };
    await client.getStorageService().set('user', user);

    expect(session.data[sessionStorageKey('user')]).toEqual(user);
  });
});
