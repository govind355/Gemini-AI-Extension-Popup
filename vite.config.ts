import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Custom plugin to copy manifest.json and icons to dist/ during build
const copyExtensionFiles = () => {
  return {
    name: 'copy-extension-files',
    closeBundle: async () => {
      const filesToCopy = ['manifest.json', 'icon16.png', 'icon48.png', 'icon128.png'];
      
      filesToCopy.forEach(file => {
        if (fs.existsSync(file)) {
          fs.copyFileSync(file, resolve(__dirname, `dist/${file}`));
          console.log(`Copied ${file} to dist/`);
        }
      });
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    copyExtensionFiles()
  ],
  base: './', // Crucial: Allows assets to be loaded via relative paths in Chrome Extension
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    // Injects the API key from environment variables during build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});