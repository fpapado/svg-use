import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    // Need a DOM to test Storage and React rendering
    environment: 'happy-dom',
    testTimeout: 1000,
    // Used to wire up cleanup and `expect` module augmentation
    setupFiles: ['./vitest-setup.ts'],
  },
});
