<script lang="ts" setup>
import artworks from '@components/artworks.json'
import type { Artworks } from '../types'

function shuffleObject(obj: Artworks) {
	const entries = Object.entries(obj)

	for (let i = entries.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[entries[i], entries[j]] = [entries[j], entries[i]]
	}

	const shuffledObj: Artworks = {}
	entries.forEach(([key, value], index) => {
		shuffledObj[index + 1] = value
	})

	return shuffledObj
}

const shuffledArtworks: Artworks = shuffleObject(artworks)
console.log(shuffledArtworks)
</script>

<template>
	<div class="columns-3 gap-3">
		<figure v-for="artwork in shuffledArtworks">
			<a :href="'/portfolio/' + artwork.slug">
				<img
					:src="artwork.images[0]"
					:alt="artwork.name"
					class="mb-3 h-auto w-full max-w-full"
					width="400"
					height="300"
					loading="lazy"
				/>
				<figcaption>{{ artwork.name }}</figcaption>
			</a>
		</figure>
	</div>
</template>

<style>
figure {
	@apply relative;

	&:hover figcaption {
		@apply opacity-100;
	}
}

figcaption {
	@apply absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-white/90 text-2xl font-bold text-black opacity-0 transition-opacity;
}
</style>
