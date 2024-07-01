<script lang="ts" setup>
import artworks from './kunstwerken.json'
</script>

<template>
	<div class="columns-3 gap-3">
		<figure v-for="artwork in artworks">
			<img
				:src="artwork.image"
				:alt="artwork.name"
				class="mb-3 h-auto w-full max-w-full rounded-lg"
				loading="lazy"
			/>
			<figcation>{{ artwork.name }}</figcation>
		</figure>
	</div>
</template>
