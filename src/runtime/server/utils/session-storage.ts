/**
 * Namespace of the SDK storage in the session: keys are saved as `<name><separator><key>`.
 * Passed explicitly to the API client, so code reading the session without the SDK
 * (e.g. route middleware) builds the same keys. Values match the SDK defaults:
 * existing sessions stay valid.
 */
export const SESSION_STORAGE = { name: 'bedita', separator: '.' } as const;

export const sessionStorageKey = (key: string): string => `${SESSION_STORAGE.name}${SESSION_STORAGE.separator}${key}`;
