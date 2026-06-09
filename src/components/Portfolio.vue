<script lang="ts" setup>
import { ref, computed } from 'vue'
import artworks from '@data/artworks.json'

import { categories } from '@utils/constants'

// Map of artwork slug -> optimized webp thumbnail (src + intrinsic size),
// generated at build time by the parent Astro page (portfolio.astro).
defineProps<{
	thumbnails: Record<string, { src: string; width: number; height: number }>
}>()

const reversedArtworks = Object.values(artworks).reverse()

const selectedCategory = ref<string | null>(null)
const isVisible = ref(true)

const filteredArtworks = computed(() => {
	if (!selectedCategory.value) {
		return reversedArtworks.filter((artwork) => artwork.category !== null)
	}

	return reversedArtworks.filter(
		(artwork) =>
			selectedCategory.value !== null &&
			artwork.category !== null &&
			artwork.category.includes(selectedCategory.value)
	)
})

const selectCategory = async (category: string) => {
	isVisible.value = false
	await new Promise((r) => setTimeout(r, 150))
	selectedCategory.value = selectedCategory.value === category ? null : category
	isVisible.value = true
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

	<div
		class="portfolio-grid columns-1 gap-3 sm:columns-2 lg:columns-3"
		:class="{ 'is-hidden': !isVisible }"
	>
		<figure v-for="artwork in filteredArtworks" :key="artwork.slug">
			<a :href="'/portfolio/' + artwork.slug" class="bg-gray">
				<img
					:src="thumbnails[artwork.slug].src"
					:alt="artwork.name"
					:width="thumbnails[artwork.slug].width"
					:height="thumbnails[artwork.slug].height"
					class="mb-3 h-auto w-full"
					loading="lazy"
				/>
				<span class="figcaption">{{ artwork.name }}</span>
			</a>
		</figure>
	</div>
</template>

<style scoped>
@reference "tailwindcss";

.portfolio-grid {
	transition: opacity 150ms ease;

	&.is-hidden {
		opacity: 0;
	}
}

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
