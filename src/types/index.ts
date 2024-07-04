export interface Artwork {
	name: string
	image: string
	category: string
	slug: string
	text: string
}

export interface Artworks {
	[key: string]: Artwork
}
