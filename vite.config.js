import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        adminInput: resolve(__dirname, 'admin-input.html'),
        laporan: resolve(__dirname, 'laporan.html'),
      },
    },
  },
})
