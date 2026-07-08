import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// 개발 서버는 5173, BE(:8080) 는 CORS(localhost:*) 허용됨.
// '@' → src 별칭은 tsconfig paths 와 동일하게 여기서도 등록해야 번들러가 해석한다.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
