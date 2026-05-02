<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { tmdb, imageUrl, pickBestTrailer } from '@/api/tmdb'
import { useFavoritesStore } from '@/stores/favorites'
import type { MovieDetails, Movie } from '@/types/movie'
import MovieCard from '@/components/MovieCard.vue'
import DetailSkeleton from '@/components/DetailSkeleton.vue'

const route = useRoute()
const favorites = useFavoritesStore()

const movie = ref<MovieDetails | null>(null)
const trailerKey = ref<string | null>(null)
const watchProviders = ref<Array<{ provider_id: number; provider_name: string; logo_path: string }>>([])
const providerLink = ref<string | null>(null)
const similar = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showTrailerPlayer = ref(false)

const movieId = computed(() => Number(route.params.id))

const isFav = computed(() => movie.value ? favorites.isFavorite(movie.value.id) : false)

const backdropUrl = computed(() => {
  if (!movie.value?.backdrop_path) return null
  return imageUrl(movie.value.backdrop_path, 'w1280')
})

const posterUrl = computed(() => {
  if (!movie.value?.poster_path) return null
  return imageUrl(movie.value.poster_path, 'w500')
})

function formatRuntime(minutes: number | null): string {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m}min`
}

function formatYear(date: string): string {
  if (!date) return ''
  return String(new Date(date).getFullYear())
}

function toggleFavorite() {
  if (!movie.value) return
  // On stocke uniquement les champs Movie (pas MovieDetails) pour rester léger
  const lite: Movie = {
    id: movie.value.id,
    title: movie.value.title,
    original_title: movie.value.original_title,
    overview: movie.value.overview,
    poster_path: movie.value.poster_path,
    backdrop_path: movie.value.backdrop_path,
    release_date: movie.value.release_date,
    vote_average: movie.value.vote_average,
    vote_count: movie.value.vote_count,
    popularity: movie.value.popularity,
  }
  favorites.toggle(lite)
}

async function loadMovie(id: number) {
  loading.value = true
  error.value = null
  showTrailerPlayer.value = false
  trailerKey.value = null
  watchProviders.value = []
  providerLink.value = null
  similar.value = []

  try {
    const [details, videos, providers, similarData] = await Promise.all([
      tmdb.getDetails(id),
      tmdb.getVideos(id),
      tmdb.getWatchProviders(id),
      tmdb.getSimilar(id),
    ])

    movie.value = details

    const trailer = pickBestTrailer(videos.results)
    trailerKey.value = trailer?.key ?? null

    // Watch providers : on prend la France par défaut, sinon US, sinon n'importe lequel
    const frProviders = providers.results['FR'] || providers.results['US'] || Object.values(providers.results)[0]
    if (frProviders) {
      watchProviders.value = frProviders.flatrate || []
      providerLink.value = frProviders.link
    }

    similar.value = similarData.results.slice(0, 8)
  } catch (e) {
    error.value = 'Impossible de charger les détails de ce film'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Recharger quand l'ID change (navigation entre films similaires)
watch(movieId, (newId) => {
  if (newId) {
    loadMovie(newId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}, { immediate: false })

onMounted(() => {
  if (movieId.value) loadMovie(movieId.value)
})
</script>

<template>
  <DetailSkeleton v-if="loading" />

  <div v-else-if="error" class="container mx-auto px-4 py-16 text-center">
    <p class="text-cinema-accentLight mb-4">{{ error }}</p>
    <RouterLink to="/" class="text-cinema-accentLight hover:underline">← Retour à l'accueil</RouterLink>
  </div>

  <div v-else-if="movie">
    <!-- Hero avec backdrop -->
    <div class="relative min-h-[420px] md:min-h-[480px]">
      <div
        v-if="backdropUrl"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${backdropUrl})` }"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/85 to-cinema-dark/40"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-cinema-dark/95 via-cinema-dark/50 to-transparent"></div>

      <div class="relative z-10 container mx-auto px-4 md:px-8 pt-6 pb-10">
        <RouterLink to="/" class="inline-flex items-center gap-2 text-xs text-cinema-text/60 hover:text-cinema-text tracking-wide mb-6 transition">
          <span>←</span> Retour
        </RouterLink>

        <div class="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end pt-12 md:pt-20">
          <div v-if="posterUrl" class="hidden md:block w-[180px] flex-shrink-0">
            <img :src="posterUrl" :alt="movie.title" class="w-full rounded-md ring-1 ring-cinema-border" />
          </div>

          <div class="flex-1">
            <div v-if="movie.genres && movie.genres.length" class="text-xs text-cinema-accentLight tracking-widest uppercase mb-2">
              {{ movie.genres.map(g => g.name).join(' · ') }}
            </div>
            <h1 class="font-serif text-3xl md:text-5xl text-cinema-text leading-[1.05] mb-2">
              {{ movie.title }}
            </h1>
            <p v-if="movie.tagline" class="font-serif italic text-cinema-text/60 text-sm md:text-base mb-3">
              "{{ movie.tagline }}"
            </p>
            <div class="flex items-center gap-3 text-sm text-cinema-text/70">
              <span>{{ formatYear(movie.release_date) }}</span>
              <span class="opacity-40">·</span>
              <span>{{ formatRuntime(movie.runtime) }}</span>
              <span class="opacity-40">·</span>
              <span class="flex items-center gap-1">
                <span class="text-yellow-400">★</span>
                {{ movie.vote_average.toFixed(1) }} / 10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu -->
    <div class="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      <!-- Actions -->
      <div class="flex flex-wrap gap-3 mb-10">
        <button
          @click="toggleFavorite"
          class="px-5 py-2.5 rounded-md text-sm font-medium tracking-wide transition flex items-center gap-2"
          :class="isFav
            ? 'bg-cinema-accent text-cinema-text'
            : 'border border-cinema-border text-cinema-text hover:border-cinema-accent'"
        >
          <span v-if="isFav">♥</span>
          <span v-else>+</span>
          {{ isFav ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
        </button>
        <button
          v-if="trailerKey && !showTrailerPlayer"
          @click="showTrailerPlayer = true"
          class="px-5 py-2.5 rounded-md text-sm font-medium tracking-wide border border-cinema-border text-cinema-text hover:border-cinema-accent transition flex items-center gap-2"
        >
          ▸ Bande-annonce
        </button>
      </div>

      <!-- Synopsis -->
      <section class="mb-10">
        <h2 class="font-serif text-lg text-cinema-text mb-3">Synopsis</h2>
        <p class="text-sm md:text-base text-cinema-text/75 leading-relaxed">
          {{ movie.overview || 'Aucun synopsis disponible en français.' }}
        </p>
      </section>

      <!-- Trailer -->
      <section v-if="trailerKey && showTrailerPlayer" class="mb-10">
        <h2 class="font-serif text-lg text-cinema-text mb-4">Bande-annonce</h2>
        <div class="aspect-video bg-cinema-surface rounded-md overflow-hidden ring-1 ring-cinema-border">
          <iframe
            :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`"
            class="w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
          ></iframe>
        </div>
      </section>

      <!-- Watch providers -->
      <section v-if="watchProviders.length > 0" class="mb-10">
        <h2 class="font-serif text-lg text-cinema-text mb-4">Où regarder</h2>
        <div class="flex flex-wrap gap-3">
          
          <a  v-for="provider in watchProviders"
            :key="provider.provider_id"
            :href="providerLink || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-cinema-surface border border-cinema-border rounded-lg px-4 py-3 flex items-center gap-3 hover:border-cinema-accent transition"
          >
            <img
              v-if="provider.logo_path"
              :src="imageUrl(provider.logo_path, 'w200')!"
              :alt="provider.provider_name"
              class="w-8 h-8 rounded-md object-cover"
            />
            <span class="text-sm text-cinema-text">{{ provider.provider_name }}</span>
          </a>
        </div>
        <p class="text-xs text-cinema-muted mt-3 italic">
          Disponibilités selon votre région. Cliquez pour ouvrir la plateforme.
        </p>
      </section>

      <!-- Similar movies -->
      <section v-if="similar.length > 0">
        <h2 class="font-serif text-lg text-cinema-text mb-4">Films similaires</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          <MovieCard
            v-for="m in similar"
            :key="m.id"
            :movie="m"
          />
        </div>
      </section>
    </div>
  </div>
</template>