import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Pe GitHub Pages aplicația stă la https://<utilizator>.github.io/teste-en/
export default defineConfig({
  base: '/teste-en/',
  plugins: [vue()],
});
