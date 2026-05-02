<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'

const favoritesStore = useFavoritesStore()
const { favorites, count } = storeToRefs(favoritesStore)

function handleClearAll() {
  if (window.confirm('Vider tous les favoris ? Cette action est irréversible.')) {
    favoritesStore.clear()
  }
}
</script>

<template>
  <div class="container mx-auto px-4 md:px-8 py-10 md:py-14">
    <div class="flex justify-between items-baseline mb-8 md:mb-12">
      <div>
        <h1 class="font-serif text-3xl md:text-4xl text-cinema-text mb-1">
          Mes favoris
        </h1>
        <p class="text-sm text-cinema-muted">
          {{ count }} film{{ count > 1 ? 's' : '' }} dans votre collection
        </p>
      </div>
      <button
        v-if="count > 0"
        @click="handleClearAll"
        class="text-xs text-cinema-muted hover:text-cinema-accentLight tracking-wide transition"
      >
        Tout vider
      </button>
    </div>

    <div v-if="count === 0" class="text-center py-16 md:py-24">
      <div class="font-serif text-2xl text-cinema-text/40 mb-4">♡</div>
      <p class="text-cinema-text mb-2">Aucun film dans vos favoris</p>
      <p class="text-sm text-cinema-muted mb-6">
        Explorez le catalogue et ajoutez vos films préférés.
      </p>
      <RouterLink
        to="/"
        class="inline-block bg-cinema-accent hover:bg-cinema-accentLight text-cinema-text px-5 py-2.5 rounded-md text-sm font-medium tracking-wide transition"
      >
        Découvrir des films
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      <MovieCard
        v-for="movie in favorites"
        :key="movie.id"
        :movie="movie"
      />
    </div>
  </div>
</template>