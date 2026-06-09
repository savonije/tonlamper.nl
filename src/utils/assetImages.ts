import type { ImageMetadata } from 'astro'

// Eagerly import every image referenced from JSON data (exposities + media) so
// it can be optimized at build time by Astro's image pipeline. Keys look like
// "/src/assets/exposities/uit-het-donker.jpg".
const images = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/{exposities,in-de-media}/**/*.{jpg,jpeg,png,webp,avif}',
	{ eager: true }
)

// Resolve a path as stored in the JSON data files
// ("/images/exposities/uit-het-donker.jpg") to its imported image module.
export function getAssetImage(jsonPath: string): ImageMetadata {
	const key = jsonPath.replace('/images/', '/src/assets/')
	const mod = images[key]

	if (!mod) {
		throw new Error(
			`Asset image not found for "${jsonPath}" (looked for "${key}")`
		)
	}

	return mod.default
}
