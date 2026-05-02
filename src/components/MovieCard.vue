<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Movie } from '@/types/movie'
import { imageUrl } from '@/api/tmdb'
import { useTrailerCache } from '@/composables/useTrailerCache'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps<{
  movie: Movie
}>()

const { getTrailerKey } = useTrailerCache()
const favorites = useFavoritesStore()

const showTrailer = ref(false)
const trailerKey = ref<string | null>(null)
const hoverTimer = ref<number | undefined>(undefined)

const isFav = computed(() => favorites.isFavorite(props.movie.id))

async function handleMouseEnter(movieId: number) {
  hoverTimer.value = window.setTimeout(async () => {
    const key = await getTrailerKey(movieId)
    if (key) {
      trailerKey.value = key
      showTrailer.value = true
    }
  }, 600)
}

function handleMouseLeave() {
  if (hoverTimer.value) clearTimeout(hoverTimer.value)
  showTrailer.value = false
  trailerKey.value = null
}

function handleFavClick(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  favorites.toggle(props.movie)
}

onUnmounted(() => {
  if (hoverTimer.value) clearTimeout(hoverTimer.value)
})

function formatYear(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).getFullYear()
}
</script>

<template>
  <RouterLink
    :to="`/movie/${movie.id}`"
    class="group block"
    @mouseenter="handleMouseEnter(movie.id)"
    @mouseleave="handleMouseLeave"
  >
    <div class="aspect-[2/3] bg-cinema-surface rounded-md overflow-hidden relative ring-1 ring-cinema-border group-hover:ring-cinema-accent/60 transition-all duration-300">
      <img
        v-if="imageUrl(movie.poster_path, 'w500')"
        :src="imageUrl(movie.poster_path, 'w500')!"
        :alt="movie.title"
        class="w-full h-full object-cover transition-opacity duration-300"
        :class="{ 'opacity-0': showTrailer }"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-cinema-muted text-4xl"
      >
        🎬
      </div>

      <div
        v-if="showTrailer && trailerKey"
        class="absolute inset-0 bg-cinema-dark"
      >
        <iframe
          :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${trailerKey}`"
          class="w-full h-full pointer-events-none"
          frameborder="0"
          allow="autoplay; encrypted-media"
        ></iframe>
        <div class="absolute inset-0 ring-2 ring-cinema-accent rounded-md pointer-events-none"></div>
      </div>

      <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-[11px] font-medium flex items-center gap-1 z-10">
        <span class="text-yellow-400">★</span>
        {{ movie.vote_average.toFixed(1) }}
      </div>

      <button
        @click="handleFavClick"
        class="absolute top-2 left-2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center text-sm transition z-10"
        :class="isFav
          ? 'bg-cinema-accent/90 text-cinema-text'
          : 'bg-black/60 text-cinema-text/70 hover:bg-black/80 hover:text-cinema-text'"
        :aria-label="isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      >
        {{ isFav ? '♥' : '♡' }}
      </button>

      <div class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cinema-dark/90 to-transparent pointer-events-none"></div>
    </div>

    <div class="mt-3">
      <h3 class="font-medium text-sm text-cinema-text truncate group-hover:text-cinema-accentLight transition">
        {{ movie.title }}
      </h3>
      <p class="text-xs text-cinema-muted mt-1">
        {{ formatYear(movie.release_date) }}
      </p>
    </div>
  </RouterLink>
</template>