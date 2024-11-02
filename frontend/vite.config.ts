import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  nodePolyfills()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }]
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'keys/myCA_decrypted.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'keys/myCA.pem'))
    },
    port: 3000
  },
})
