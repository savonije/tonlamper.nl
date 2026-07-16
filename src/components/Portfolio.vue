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

const clearFilter = async () => {
	if (!selectedCategory.value) return
	isVisible.value = false
	await new Promise((r) => setTimeout(r, 150))
	selectedCategory.value = null
	isVisible.value = true
}
</script>

<template>
	<section class="pt-10 pb-10 lg:pt-16">
		<p class="eyebrow mb-6">Grafiek &amp; drukwerk</p>
		<h1 class="mb-8 text-6xl sm:text-7xl">Portfolio</h1>
	</section>

	<!-- Filter bar -->
	<div
		class="filter-bar border-t-ink flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-b py-4"
	>
		<button
			type="button"
			class="filter-btn"
			:class="{ 'is-active': !selectedCategory }"
			@click="clearFilter"
		>
			Alles
		</button>
		<button
			type="button"
			v-for="category in categories"
			:key="category"
			class="filter-btn"
			:class="{ 'is-active': selectedCategory === category }"
			@click="selectCategory(category)"
		>
			{{ category }}
		</button>
	</div>

	<div
		class="portfolio-grid mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3"
		:class="{ 'is-hidden': !isVisible }"
	>
		<figure
			v-for="artwork in filteredArtworks"
			:key="artwork.slug"
			class="mb-5 break-inside-avoid"
		>
			<a
				:href="'/portfolio/' + artwork.slug"
				class="art-link group relative block overflow-hidden no-underline"
			>
				<img
					:src="artwork.thumb.src"
					:alt="artwork.name"
					:width="artwork.thumb.width"
					:height="artwork.thumb.height"
					:style="{ viewTransitionName: 'art-' + artwork.slug }"
					class="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
					loading="lazy"
				/>
				<figcaption class="figcaption">
					<span class="figcaption__name">{{ artwork.name }}</span>
				</figcaption>
			</a>
		</figure>
	</div>
</template>

<style scoped>
@reference '@styles/base.css';

.filter-btn {
	@apply text-2xs tracking-label text-ink-3 relative cursor-pointer pb-1 font-mono uppercase transition-colors;
}
.filter-btn::after {
	content: '';
	@apply bg-accent absolute right-0 bottom-0 left-0 h-[1.5px] origin-left scale-x-0 transition-transform duration-300;
}
.filter-btn:hover {
	@apply text-ink;
}
.filter-btn.is-active {
	@apply text-ink;
}
.filter-btn.is-active::after {
	@apply scale-x-100;
}

.portfolio-grid {
	transition: opacity 150ms ease;

	&.is-hidden {
		opacity: 0;
	}
}

.art-link {
	@apply border-line-2 border;
}

.figcaption {
	@apply absolute inset-0 z-10 flex items-end p-4 opacity-0 transition-opacity duration-300;
	background: linear-gradient(
		to top,
		rgb(22 22 26 / 0.78) 0%,
		rgb(22 22 26 / 0.1) 55%,
		transparent 100%
	);
}
.art-link:hover .figcaption {
	@apply opacity-100;
}
.figcaption__name {
	@apply font-display text-paper translate-y-1 text-2xl font-medium transition-transform duration-300;
}
.art-link:hover .figcaption__name {
	@apply translate-y-0;
}
</style>
