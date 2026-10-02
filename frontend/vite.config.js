import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // (ทางเลือก) ถ้าใช้ Vercel CLI รัน จะจำลอง api ได้สมบูรณ์กว่า แต่ถ้าใช้ vite ปกติ ให้เช็คไฟล์ api ให้พร้อม
  }
});