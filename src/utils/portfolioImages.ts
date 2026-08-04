import type { ImageMetadata } from 'astro'

// Eagerly import every portfolio source image so it can be optimized at build
// time by Astro's image pipeline. Keys look like
// "/src/assets/portfolio/atlas.jpg".
const images = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/portfolio/**/*.{jpg,jpeg,png,webp,avif}',
	{ eager: true }
)

// Resolve a path as stored in artworks.json ("/images/portfolio/atlas.jpg")
// to its imported image module.
export function getPortfolioImage(jsonPath: string): ImageMetadata {
	const key = jsonPath.replace('/images/portfolio/', '/src/assets/portfolio/')
	const mod = images[key]

	if (!mod) {
		throw new Error(`Portfolio image not found for "${jsonPath}" (looked for "${key}")`)
	}

	return mod.default
}
