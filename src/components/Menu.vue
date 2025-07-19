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

onMounted(() => {
	if (window.innerWidth < 1024) {
		isMenuOpen.value = false
	}

	document.addEventListener('keydown', closeOnEscape)
})

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
		@keydown.esc="isMenuOpen = false"
	>
		<a href="/" @click="isMenuOpen = false">Home</a>
		<a href="/de-kunstenaar" @click="isMenuOpen = false">Kunstenaar</a>
		<a href="/biografie" @click="isMenuOpen = false">Biografie</a>
		<a href="/portfolio" @click="isMenuOpen = false">Portfolio</a>
		<a href="/cursussen" @click="isMenuOpen = false">Cursussen</a>
		<a href="/exposities" @click="isMenuOpen = false">Exposities</a>
		<a href="/in-de-media" @click="isMenuOpen = false">In de media</a>
		<a href="/contact" @click="isMenuOpen = false">Contact</a>

		<button
			role="button"
			@click="openMenu(false)"
			class="absolute top-5 right-5 text-3xl text-black lg:hidden"
			aria-label="Sluit menu"
		>
			&times;
		</button>
	</nav>
</template>

<style>
@reference "tailwindcss";

.main-menu {
	@apply fixed top-0 right-0 z-50 flex h-full w-[90%] translate-x-full flex-col items-center gap-3 bg-white p-20 text-neutral-700 shadow-lg transition-transform lg:relative lg:w-full lg:translate-x-0 lg:flex-row lg:justify-end lg:gap-9 lg:p-0 lg:shadow-none;

	&.open {
		@apply translate-x-0;
	}

	a {
		@apply block w-full text-lg font-bold lg:w-auto lg:text-sm lg:font-normal;

		&:after {
			@apply lg:block lg:h-[1px] lg:w-0 lg:bg-black lg:transition-all lg:content-[''];
		}

		.active {
			@apply underline underline-offset-8;
		}
	}

	a:hover:after {
		@apply lg:w-full;
	}
}
</style>
