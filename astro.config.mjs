import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import vercel from '@astrojs/vercel/serverless';

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  output: 'hybrid',
  adapter: isVercel ? vercel() : netlify(),
  integrations: [tailwind()],
  site: 'https://dumb-moneyy.vercel.app',
});
