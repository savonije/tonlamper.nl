import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { file } from 'astro/loaders'

// artworks.json is a keyed object ("1", "2", …) — the file() loader uses those
// keys as entry ids directly, so no parser is needed.
const artworks = defineCollection({
	loader: file('src/data/artworks.json'),
	schema: z.object({
		name: z.string(),
		images: z.array(z.string()),
		category: z.array(z.string()).nullable(),
		featured: z.boolean().default(false),
		slug: z.string(),
		text: z.string()
	})
})

// The remaining files are plain arrays without id fields, so add a stable
// index-based id in a parser. Sorting entries by numeric id later reproduces
// the original array order.
const withIndexIds = (text: string) =>
	(JSON.parse(text) as unknown[]).map((item, i) => ({
		id: String(i),
		...(item as object)
	}))

const expositions = defineCollection({
	loader: file('src/data/expositions.json', { parser: withIndexIds }),
	schema: z.object({
		title: z.string(),
		location: z.string(),
		date: z.string(),
		linkUrl: z.string(),
		linkText: z.string().optional(),
		imageSrc: z.string().optional(),
		imageAlt: z.string().optional(),
		description: z.string().optional(),
		locationLabel: z.string().optional(),
		dateLabel: z.string().optional()
	})
})

const media = defineCollection({
	loader: file('src/data/media.json', { parser: withIndexIds }),
	schema: z.object({
		url: z.string(),
		date: z.string(),
		outlet: z.string(),
		title: z.string(),
		image: z.object({
			src: z.string(),
			alt: z.string(),
			width: z.number(),
			height: z.number(),
			credit: z.string()
		})
	})
})

const biografie = defineCollection({
	loader: file('src/data/biografie.json', { parser: withIndexIds }),
	schema: z.object({
		year: z.string(),
		text: z.string()
	})
})

export const collections = { artworks, expositions, media, biografie }
