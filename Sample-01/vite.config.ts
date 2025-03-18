/// <reference types= "vitest/config" />
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'

export const viteConfig = defineConfig({
  plugins: [react(), tailwindcss(), !process.env.VITEST && reactRouter(), tsconfigPaths()],
})

export const vitestConfig = defineVitestConfig({
  test: {
    name: 'react spa',
    globals: true,
    setupFiles: './src/setupTests.ts',
    environment: 'jsdom',
    // browser: {
    //   enabled: true,
    //   name: "chromium",
    //   headless: true,
    //   provider: "playwright",
    //   instances: [{ browser: "chromium" }],
    // },
  },
})

const config = {
  ...viteConfig,
  ...vitestConfig,
}

export default config
