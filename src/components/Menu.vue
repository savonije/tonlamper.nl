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
	<div class="lg:hidden">
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

		<button
			role="button"
			@click="openMenu(false)"
			class="absolute right-5 top-5 text-3xl text-black"
			aria-label="Sluit menu"
		>
			&times;
		</button>
	</nav>
</template>

<style>
.main-menu {
	@apply fixed right-0 top-0 z-50 flex h-full w-[90%] translate-x-full flex-col items-center gap-3 bg-white p-20 text-black shadow-lg transition-transform lg:relative lg:w-full lg:translate-x-0 lg:flex-row lg:justify-end lg:gap-9 lg:p-0 lg:shadow-none;

	&.open {
		@apply translate-x-0;
	}

	a {
		@apply block w-full text-lg font-bold lg:w-auto lg:text-sm lg:font-normal;

		.active {
			@apply underline underline-offset-8;
		}
	}

	a:hover {
		@apply underline underline-offset-8;
	}
}
</style>
