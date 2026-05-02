import axios from 'axios'
import type { Movie, MovieDetails, TMDBResponse } from '@/types/movie'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

if (!API_KEY) {
  throw new Error('Missing VITE_TMDB_API_KEY environment variable')
}

const client = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'fr-FR',
  },
})

export const tmdb = {
  /** Films populaires de la semaine */
  async getPopular(page = 1): Promise<TMDBResponse<Movie>> {
    const { data } = await client.get('/movie/popular', { params: { page } })
    return data
  },

  /** Films actuellement à l'affiche */
  async getNowPlaying(page = 1): Promise<TMDBResponse<Movie>> {
    const { data } = await client.get('/movie/now_playing', {
      params: { page, region: 'FR' },
    })
    return data
  },

  /** Recherche de films */
  async search(query: string, page = 1): Promise<TMDBResponse<Movie>> {
    const { data } = await client.get('/search/movie', {
      params: { query, page },
    })
    return data
  },

  /** Détails complets d'un film */
  async getDetails(id: number): Promise<MovieDetails> {
    const { data } = await client.get(`/movie/${id}`)
    return data
  },

  /** Vidéos (trailers) d'un film */
  async getVideos(id: number): Promise<{ results: Array<{ key: string; type: string; site: string; name: string; official: boolean }> }> {
    const { data } = await client.get(`/movie/${id}/videos`, {
      params: { language: 'en-US' }, // les trailers FR sont rares, on prend en EN
    })
    return data
  },

  /** Watch providers (où regarder) d'un film */
  async getWatchProviders(id: number): Promise<{ results: Record<string, { link: string; flatrate?: Array<{ provider_id: number; provider_name: string; logo_path: string }> }> }> {
    const { data } = await client.get(`/movie/${id}/watch/providers`)
    return data
  },

  /** Films similaires */
  async getSimilar(id: number): Promise<TMDBResponse<Movie>> {
    const { data } = await client.get(`/movie/${id}/similar`)
    return data
  },
}

export const imageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500') => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

/** Récupère le meilleur trailer YouTube disponible pour un film */
export function pickBestTrailer(videos: Awaited<ReturnType<typeof tmdb.getVideos>>['results']) {
  const youtubeTrailers = videos.filter(v => v.site === 'YouTube' && v.type === 'Trailer')
  const official = youtubeTrailers.find(v => v.official)
  return official || youtubeTrailers[0] || null
}