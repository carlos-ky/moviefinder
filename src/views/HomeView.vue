<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { tmdb } from '@/api/tmdb'
import type { Movie } from '@/types/movie'
import Hero from '@/components/Hero.vue'
import SearchBar from '@/components/SearchBar.vue'
import MovieCard from '@/components/MovieCard.vue'
import MovieCardSkeleton from '@/components/MovieCardSkeleton.vue'

const heroMovie = ref<Movie | null>(null)
const movies = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const isSearchMode = ref(false)

async function loadInitialData() {
  loading.value = true
  error.value = null
  try {
    const [popularData, nowPlayingData] = await Promise.all([
      tmdb.getPopular(),
      tmdb.getNowPlaying(),
    ])

    // Choix du film hero : un film à l'affiche avec un beau backdrop, sinon premier populaire
    const candidate = nowPlayingData.results.find(m => m.backdrop_path && m.overview)
      || popularData.results.find(m => m.backdrop_path && m.overview)
      || popularData.results[0]
      || null
    heroMovie.value = candidate

    // La grille populaire : on retire le film hero si présent pour éviter le doublon
    movies.value = popularData.results.filter(m => m.id !== heroMovie.value?.id)
    isSearchMode.value = false
  } catch (e) {
    error.value = 'Erreur lors du chargement des films'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function handleSearch(query: string) {
  if (!query.trim()) {
    loadInitialData()
    return
  }

  loading.value = true
  error.value = null
  try {
    const data = await tmdb.search(query)
    movies.value = data.results
    isSearchMode.value = true
  } catch (e) {
    error.value = 'Erreur lors de la recherche'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadInitialData()
})
</script>

<template>
  <div>
    <Hero v-if="!isSearchMode" :movie="heroMovie" />

    <div class="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <div class="mb-8 md:mb-12">
        <SearchBar v-model="searchQuery" @search="handleSearch" />
      </div>

      <div class="flex justify-between items-baseline mb-6">
        <h2 class="font-serif text-xl md:text-2xl text-cinema-text">
          {{ isSearchMode ? `Résultats pour "${searchQuery}"` : 'Films populaires' }}
        </h2>
        <p v-if="!loading && movies.length > 0" class="text-xs text-cinema-muted">
          {{ movies.length }} résultat{{ movies.length > 1 ? 's' : '' }}
        </p>
      </div>

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <MovieCardSkeleton v-for="i in 12" :key="i" />
      </div>

      <div v-else-if="error" class="text-center py-12 text-cinema-accentLight">
        {{ error }}
      </div>

      <div v-else-if="movies.length === 0" class="text-center py-12 text-cinema-muted italic">
        Aucun film trouvé. Essayez une autre recherche.
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
        />
      </div>
    </div>
  </div>
</template>