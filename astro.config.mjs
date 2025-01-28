import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
	site: 'https://www.tonlamper.nl',
	integrations: [vue(), sitemap()],
	vite: {
		plugins: [tailwindcss()]
	}
})
