import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const workspaceRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@jabelic/standards-core": path.resolve(
        workspaceRoot,
        "packages/core/src/index.ts",
      ),
      "@jabelic/eslint-config": path.resolve(
        workspaceRoot,
        "packages/eslint-config/src/index.ts",
      ),
      "@jabelic/eslint-config/base": path.resolve(
        workspaceRoot,
        "packages/eslint-config/src/index.ts",
      ),
      "@jabelic/renovate-config": path.resolve(
        workspaceRoot,
        "packages/renovate-config/src/index.ts",
      ),
      "@jabelic/renovate-config/base": path.resolve(
        workspaceRoot,
        "packages/renovate-config/src/index.ts",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["packages/**/*.test.ts"],
    restoreMocks: true,
    clearMocks: true,
  },
});
