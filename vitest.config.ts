import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, // Enables describe, it, expect without import
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov'], 
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules/**', 'tests/**'],
    },
  },
});
