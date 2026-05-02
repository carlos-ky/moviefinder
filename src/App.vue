<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { storeToRefs } from 'pinia'

const favoritesStore = useFavoritesStore()
const { count } = storeToRefs(favoritesStore)
</script>

<template>
  <div class="min-h-screen bg-cinema-dark">
    <nav class="border-b border-cinema-border sticky top-0 bg-cinema-dark/95 backdrop-blur-md z-20">
      <div class="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <RouterLink to="/" class="flex items-center gap-2 group">
          <span class="text-cinema-accent text-lg group-hover:text-cinema-accentLight transition">●</span>
          <span class="font-serif text-base md:text-lg text-cinema-text tracking-wide">MovieFinder</span>
        </RouterLink>
        <div class="flex gap-6 text-sm items-center">
          <RouterLink
            to="/"
            class="text-cinema-muted hover:text-cinema-text transition tracking-wide"
            active-class="!text-cinema-accent"
          >
            Découvrir
          </RouterLink>
          <RouterLink
            to="/favorites"
            class="text-cinema-muted hover:text-cinema-text transition tracking-wide flex items-center gap-2"
            active-class="!text-cinema-accent"
          >
            Favoris
            <span
              v-if="count > 0"
              class="bg-cinema-accent text-cinema-text text-[10px] px-2 py-0.5 rounded-full font-medium"
            >
              {{ count }}
            </span>
          </RouterLink>
        </div>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>

    <footer class="border-t border-cinema-border mt-16 py-8">
      <div class="container mx-auto px-4 md:px-8 text-center text-xs text-cinema-muted">
        Données fournies par <a href="https://www.themoviedb.org/" target="_blank" rel="noopener" class="text-cinema-accentLight hover:underline">The Movie Database (TMDB)</a> · Carlos KY · 2026
      </div>
    </footer>
  </div>
</template>