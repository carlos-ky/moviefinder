import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Movie } from '@/types/movie'

const STORAGE_KEY = 'moviefinder:favorites'

function loadFromStorage(): Movie[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Movie[]>(loadFromStorage())

  // Persistance auto à chaque changement
  watch(
    favorites,
    (newFavs) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs))
      } catch (e) {
        console.error('Failed to save favorites:', e)
      }
    },
    { deep: true }
  )

  const count = computed(() => favorites.value.length)

  function isFavorite(id: number): boolean {
    return favorites.value.some(f => f.id === id)
  }

  function add(movie: Movie) {
    if (!isFavorite(movie.id)) {
      favorites.value.push(movie)
    }
  }

  function remove(id: number) {
    favorites.value = favorites.value.filter(f => f.id !== id)
  }

  function toggle(movie: Movie) {
    if (isFavorite(movie.id)) {
      remove(movie.id)
    } else {
      add(movie)
    }
  }

  function clear() {
    favorites.value = []
  }

  return {
    favorites,
    count,
    isFavorite,
    add,
    remove,
    toggle,
    clear,
  }
})