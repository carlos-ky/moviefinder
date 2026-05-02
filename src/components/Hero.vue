<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Movie } from '@/types/movie'
import { imageUrl } from '@/api/tmdb'

const props = defineProps<{
  movie: Movie | null
}>()

const backdropUrl = computed(() => {
  if (!props.movie?.backdrop_path) return null
  return imageUrl(props.movie.backdrop_path, 'w1280')
})

const formatYear = (date: string) => {
  if (!date) return ''
  return new Date(date).getFullYear()
}
</script>

<template>
  <div v-if="movie" class="relative h-[400px] md:h-[460px] overflow-hidden">
    <div
      v-if="backdropUrl"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${backdropUrl})` }"
    ></div>

    <div class="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/80 to-cinema-dark/40"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-cinema-dark/90 via-cinema-dark/40 to-transparent"></div>

    <div class="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 max-w-3xl">
      <div class="text-xs text-cinema-accentLight tracking-widest uppercase mb-3 inline-flex items-center gap-2">
        <span class="w-6 h-[1px] bg-cinema-accent"></span>
        À l'affiche
      </div>
      <h1 class="font-serif text-3xl md:text-5xl text-cinema-text mb-2 leading-tight">
        {{ movie.title }}
      </h1>
      <div class="text-sm text-cinema-text/60 mb-4 flex items-center gap-3">
        <span>{{ formatYear(movie.release_date) }}</span>
        <span class="opacity-40">·</span>
        <span class="flex items-center gap-1">
          <span class="text-yellow-400">★</span>
          {{ movie.vote_average.toFixed(1) }}
        </span>
      </div>
      <p class="text-sm md:text-base text-cinema-text/75 leading-relaxed mb-6 line-clamp-3">
        {{ movie.overview || 'Aucun synopsis disponible.' }}
      </p>
      <div class="flex gap-3">
        <RouterLink
          :to="`/movie/${movie.id}`"
          class="bg-cinema-accent hover:bg-cinema-accentLight text-cinema-text px-6 py-3 rounded-md text-sm font-medium tracking-wide transition"
        >
          Voir les détails
        </RouterLink>
      </div>
    </div>
  </div>

  <div v-else class="h-[400px] md:h-[460px] bg-cinema-surface animate-pulse"></div>
</template>