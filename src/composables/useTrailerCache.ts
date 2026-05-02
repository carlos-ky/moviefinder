import { ref } from 'vue'
import { tmdb, pickBestTrailer } from '@/api/tmdb'

const cache = ref<Map<number, string | null>>(new Map())
const inFlight = new Set<number>()

export function useTrailerCache() {
  async function getTrailerKey(movieId: number): Promise<string | null> {
    if (cache.value.has(movieId)) {
      return cache.value.get(movieId)!
    }

    if (inFlight.has(movieId)) {
      // déjà en cours de fetch, on attend un peu et on relit le cache
      await new Promise(r => setTimeout(r, 500))
      return cache.value.get(movieId) ?? null
    }

    inFlight.add(movieId)
    try {
      const videosData = await tmdb.getVideos(movieId)
      const trailer = pickBestTrailer(videosData.results)
      const key = trailer?.key ?? null
      cache.value.set(movieId, key)
      return key
    } catch (e) {
      cache.value.set(movieId, null)
      return null
    } finally {
      inFlight.delete(movieId)
    }
  }

  return { getTrailerKey }
}