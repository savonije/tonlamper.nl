<script lang="ts" setup>
import { ref, computed } from 'vue'
import artworks from '@data/artworks.json'

import { categories } from '@utils/constants'

const reversedArtworks = Object.values(artworks).reverse()

const selectedCategory = ref<string | null>(null)

const filteredArtworks = computed(() => {
	if (!selectedCategory.value) {
		return reversedArtworks.filter(
			(artwork) => artwork.category !== null && !artwork.category.includes('uitgelicht')
		)
	}

	return reversedArtworks.filter(
		(artwork) =>
			selectedCategory.value !== null &&
			artwork.category !== null &&
			artwork.category.includes(selectedCategory.value)
	)
})

const selectCategory = (category: string) => {
	if (selectedCategory.value === category) {
		return (selectedCategory.value = null)
	}

	selectedCategory.value = category
}
</script>

<template>
	<div class="mb-3 flex gap-6">
		<button
			type="button"
			v-for="category in categories"
			:key="category"
			@click="selectCategory(category)"
			:class="{ 'font-bold': selectedCategory === category }"
		>
			{{ category }}
		</button>
	</div>

	<div class="columns-1 gap-3 sm:columns-2 lg:columns-3">
		<figure v-for="artwork in filteredArtworks">
			<a :href="'/portfolio/' + artwork.slug">
				<img
					:src="artwork.images[0]"
					:alt="artwork.name"
					class="mb-3 h-auto w-full max-w-full"
					width="300"
					height="400"
					loading="lazy"
				/>
				<span class="figcaption">{{ artwork.name }}</span>
			</a>
		</figure>
	</div>
</template>

<style scoped>
@reference "tailwindcss";

button {
	@apply text-black;

	&:hover {
		@apply underline;
	}
}

figure {
	@apply relative;

	&:hover .figcaption {
		@apply opacity-100;
	}
}

.figcaption {
	@apply absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-white/90 text-center text-2xl font-bold text-black opacity-0 transition-opacity;
}
</style>
