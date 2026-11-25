import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const runtimeDir = fileURLToPath(new URL('../src/runtime', import.meta.url));

// Code bundled into the Nuxt app (route middleware, composables, states, utils)
const APP_DIRS = ['middleware', 'composables', 'states', 'utils'];

// CommonJS dependencies: inlined in the Vue SSR bundle they need require(), missing since Nuxt 4.7
const FORBIDDEN = /^(?:@atlasconsulting\/bedita-sdk|axios)(?:\/|$)/;

// Value imports and re-exports; type-only ones are erased at build time
const IMPORT_RE = /^[ \t]*(?:import|export)(?!\s+type\s)[^'";]*['"]([^'"]+)['"]/gm;

const resolveLocal = (from: string, specifier: string): string | undefined =>
  [`${specifier}.ts`, specifier, join(specifier, 'index.ts')]
    .map(candidate => resolve(dirname(from), candidate))
    .find(path => path.endsWith('.ts') && existsSync(path));

const forbiddenImports = (entry: string): string[] => {
  const found: string[] = [];
  const seen = new Set<string>();
  const visit = (file: string, chain: string[]) => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const [, specifier] of readFileSync(file, 'utf8').matchAll(IMPORT_RE)) {
      if (!specifier) continue;
      if (FORBIDDEN.test(specifier)) {
        found.push([...chain, specifier].join(' -> '));
      } else if (specifier.startsWith('.')) {
        const next = resolveLocal(file, specifier);
        if (next) visit(next, [...chain, next.replace(`${runtimeDir}/`, '')]);
      }
    }
  };
  visit(entry, [entry.replace(`${runtimeDir}/`, '')]);

  return found;
};

describe('app bundle', () => {
  const entries = APP_DIRS.flatMap(dir => readdirSync(join(runtimeDir, dir))
    .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
    .map(file => join(runtimeDir, dir, file)));

  it.each(entries.map(entry => [entry.replace(`${runtimeDir}/`, ''), entry]))('%s does not import the SDK or axios', (_, entry) => {
    expect(forbiddenImports(entry)).toEqual([]);
  });
});
