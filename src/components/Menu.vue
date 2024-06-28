<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const nav = ref(null)

onClickOutside(nav, () => (isMenuOpen.value = false))

const isMenuOpen = ref<boolean>(false)

const openMenu = (action: boolean) => {
	isMenuOpen.value = action
}

const closeOnEscape = (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		isMenuOpen.value = false
	}
}

onMounted(() => document.addEventListener('keydown', closeOnEscape))

onUnmounted(() => document.removeEventListener('keydown', closeOnEscape))
</script>

<template>
	<div class="md:hidden">
		<button
			role="button"
			@click="openMenu(true)"
			v-if="!isMenuOpen"
			class="text-3xl text-black"
			aria-label="Open menu"
		>
			☰
		</button>
	</div>

	<nav
		:class="['main-menu', isMenuOpen ? 'open' : 'closed']"
		ref="nav"
		:aria-hidden="!isMenuOpen"
		@keydown.esc="isMenuOpen = false"
	>
		<a href="/" @click="isMenuOpen = false">Home</a>
		<a href="/de-kunstenaar" @click="isMenuOpen = false">De Kunstenaar</a>
		<a href="/biografie" @click="isMenuOpen = false">Biografie</a>
		<a href="/portfolio" @click="isMenuOpen = false">Portfolio</a>
		<a href="/cursussen" @click="isMenuOpen = false">Cursussen</a>
		<a href="/exposities" @click="isMenuOpen = false">Exposities</a>
		<a href="/contact" @click="isMenuOpen = false">Contact</a>
	</nav>
</template>

<style>
.main-menu {
	@apply absolute right-0 top-0 flex h-full w-[60%] translate-x-full flex-col items-center gap-3 bg-white p-9 text-black shadow-lg transition-transform md:relative md:w-full md:translate-x-0 md:flex-row md:justify-end md:gap-9 md:p-0 md:shadow-none;

	&.open {
		@apply translate-x-0;
	}

	a {
		@apply block;

		.active {
			@apply underline underline-offset-8;
		}
	}

	a:hover {
		@apply underline underline-offset-8;
	}
}
</style>
