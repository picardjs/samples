import type { ModuleFederationRuntimePlugin } from '@module-federation/enhanced/runtime';

/**
 * Older containers (such as mf-simple-html) register their modules without the "./" prefix,
 * e.g., "column" instead of "./column". Picard.js handles this on its own - for the host
 * the same fallback is added as a runtime plugin.
 */
export default function legacyExposes(): ModuleFederationRuntimePlugin {
  return {
    name: 'legacy-exposes',
    getModuleFactory({ expose, remoteEntryExports }) {
      // the typings declare a factory, but containers return a promise of it
      const factory = remoteEntryExports.get(expose) as unknown as Promise<() => unknown>;
      return factory.then(undefined, (error: unknown) => {
        if (expose.startsWith('./') && error instanceof Error && error.message.includes('does not exist in container')) {
          return remoteEntryExports.get(expose.substring(2));
        }

        throw error;
      });
    },
  };
}
