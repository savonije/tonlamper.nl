export interface Artwork {
	name: string
	images: string[]
	category: string[] | null
	slug: string
	text: string
}

export interface Artworks {
	[key: string]: Artwork
}
