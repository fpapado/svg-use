import { defineProject } from 'vitest/config';

export default defineProject({
  server: {
    watch: {
      ignored: [
        // allow builds to trigger tests (since the loader tests operate with
        // the JS files)
        '!**/dist/**',
        // tshy modifies package.json while building, which causes to many
        // reruns
        '**/package.json',
      ],
    },
  },
  test: {
    // Need a DOM to test Storage and React rendering
    environment: 'happy-dom',
    testTimeout: 1000,
    // Used to wire up cleanup and `expect` module augmentation
    setupFiles: ['./vitest-setup.ts'],
  },
});
