export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  popularity: number
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number | null
  tagline: string | null
  status: string
  production_companies: { id: number; name: string }[]
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}