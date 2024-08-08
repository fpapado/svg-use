import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Vitest does not expose globals by default, so we need to wire up
 * testing-library's cleanup manually.
 */
afterEach(() => {
  cleanup();
});
