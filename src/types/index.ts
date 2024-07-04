export interface Artwork {
	name: string
	image: string
	category: string
	slug: string
}

export interface Artworks {
	[key: string]: Artwork
}
