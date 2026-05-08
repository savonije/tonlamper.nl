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

export interface Exposition {
	title: string
	location: string
	date: string
	linkUrl: string
	linkText?: string
	imageSrc?: string
	imageAlt?: string
	imageWidth?: number
	imageHeight?: number
	description?: string
	locationLabel?: string
	dateLabel?: string
}
