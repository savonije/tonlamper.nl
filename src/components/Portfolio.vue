<script lang="ts" setup>
import { ref, computed } from 'vue'

import { categories } from '@utils/constants'

// The parent Astro page (portfolio.astro) prepares everything the grid needs at
// build time — already ordered newest-first — so the island ships no artwork
// text bodies and does no data wrangling on the client.
type Item = {
	slug: string
	name: string
	category: string[] | null
	thumb: { src: string; width: number; height: number }
}

const props = defineProps<{ items: Item[] }>()

const selectedCategory = ref<string | null>(null)
const isVisible = ref(true)

const filteredArtworks = computed(() => {
	if (!selectedCategory.value) {
		return props.items.filter((item) => item.category !== null)
	}

	return props.items.filter(
		(item) =>
			selectedCategory.value !== null &&
			item.category !== null &&
			item.category.includes(selectedCategory.value)
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
					:src="artwork.thumb.src"
					:alt="artwork.name"
					:width="artwork.thumb.width"
					:height="artwork.thumb.height"
					:style="{ viewTransitionName: 'art-' + artwork.slug }"
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
