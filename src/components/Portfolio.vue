<script lang="ts" setup>
import artworks from './kunstwerken.json'
</script>

<template>
	<div class="columns-3 gap-3">
		<figure v-for="artwork in artworks">
			<a :href="'/portfolio/' + artwork.slug">
				<img
					:src="artwork.image"
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
