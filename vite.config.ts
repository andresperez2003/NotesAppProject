import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/NotesAppProject/', // 👈 este es el nombre de tu repo
})
