import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      plugins: [react({})],
      'proccess.env.SECRET_TOKEN': JSON.stringify(env.SECRET_TOKEN),
    },
  }
})
