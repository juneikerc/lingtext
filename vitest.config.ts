import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths({ projects: ["./tsconfig.vite.json"] })],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
