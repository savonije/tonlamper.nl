export interface Artwork {
	name: string
	images: string[]
	category: string
	slug: string
	text: string
}

export interface Artworks {
	[key: string]: Artwork
}
