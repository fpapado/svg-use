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
    testTimeout: 1000,
  },
});
