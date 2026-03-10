import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,       // 같은 네트워크 기기에서 접속 허용
    qr: true,         // Vite 7: 터미널에 QR 코드 자동 출력
  },
})
