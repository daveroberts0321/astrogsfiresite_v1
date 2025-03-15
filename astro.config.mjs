// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Enable server-side rendering
  output: 'server',
  
  // Define integrations
  integrations: [
    // Configure Tailwind integration
    tailwind()
  ],
  
  // Vite configuration
  vite: {
    // External dependencies that should not be bundled
    build: {
      rollupOptions: {
        external: ['ioredis']
      }
    },
    ssr: {
      external: ['ioredis']
    }
  },
  
  // Netlify adapter for deployment
  adapter: netlify()
});