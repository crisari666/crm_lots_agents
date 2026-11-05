import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = fileURLToPath(new URL(".", import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@omega/project-experience",
        replacement: path.resolve(
          rootDir,
          "../omega-project-experience/src/index.ts"
        )
      },
      // Package lives outside this app, so bare imports must hit this app's deps.
      {
        find: /^mapbox-gl/,
        replacement: path.resolve(rootDir, "node_modules/mapbox-gl")
      },
      {
        find: /^three/,
        replacement: path.resolve(rootDir, "node_modules/three")
      }
    ]
  },
  server: {
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
    minify: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
