// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  /**
   * Canonical + Open Graph URLs are built from this. It must be YOUR domain:
   * pointing it at someone else's tells search engines your content belongs
   * to them. Set SITE_URL in .env (and in your host's environment) before
   * deploying; the fallback is deliberately invalid so a mistake is loud
   * rather than silent.
   */
  site: process.env.SITE_URL || 'https://set-your-domain.invalid',
  // Static by default. When we wire up the mural backend we'll switch the
  // mural API route (and only that route) to server-rendered.
  output: 'static',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-display',
      weights: [340, 500],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-body',
      weights: [400, 500],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],
});
