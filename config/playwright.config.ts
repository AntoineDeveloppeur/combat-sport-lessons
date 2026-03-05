import { defineConfig } from "@playwright/test"
import { config } from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, "../.env") })

export default defineConfig({
  testDir: "../tests/integration",
  outputDir: "../tests/test-results",
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: process.env.FRONTEND_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "cd ../backend && npm run db:reset",
      port: 5432,
      reuseExistingServer: true,
    },
    {
      command:
        'cd ../backend && concurrently "npm run type:watch" "npm run dev"',
      port: 4000,
      reuseExistingServer: true,
    },
    {
      command: "cd ../frontend && npm run dev",
      port: 3000,
      reuseExistingServer: true,
    },
  ],
})
