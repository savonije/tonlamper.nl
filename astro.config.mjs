import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
	site: 'https://www.tonlamper.nl',
	integrations: [sitemap()],
	// Prefetch links as they enter the viewport for snappier navigation
	// (ClientRouter otherwise only prefetches on hover).
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport'
	},
	// Default responsive layout so <Image> auto-generates srcset/sizes and the
	// matching styles. Fixed-size images opt out with layout="fixed".
	image: {
		layout: 'constrained',
		responsiveStyles: true
	},
	vite: {
		plugins: [tailwindcss()]
	}
})
