# MovieFinder

Application web de recherche et exploration de films, construite avec **Vue.js 3, TypeScript et Tailwind CSS**, connectée à l'API TMDB. Design cinématographique, autoplay des trailers au survol, favoris persistants.

[**Live Demo →**](https://moviefinder-orpin.vercel.app/)

## Fonctionnalités

- **Recherche en temps réel** avec debounce (400ms) pour limiter les appels API
- **Hero cinématographique** sur la page d'accueil avec backdrop dégradé et film à l'affiche
- **Autoplay des trailers au survol** des cartes (YouTube embed muet, lazy-loaded après 600ms)
- **Page détail premium** : backdrop, poster, tagline, métadonnées, synopsis, trailer YouTube intégré, plateformes de streaming légales (Netflix, Prime Video, etc.), films similaires
- **Favoris persistants** via Pinia + localStorage, accessibles depuis chaque carte ou la page détail
- **Skeleton loaders** pour une expérience de chargement fluide
- **Responsive** : grilles adaptatives de 2 à 6 colonnes selon la taille d'écran

## Stack

- **Framework** : Vue.js 3 (Composition API + `<script setup>`)
- **Langage** : TypeScript (strict)
- **Build tool** : Vite
- **Styling** : Tailwind CSS avec palette dark cinéma personnalisée
- **State global** : Pinia (style Composition API)
- **Routing** : Vue Router 4
- **HTTP client** : Axios
- **API** : The Movie Database (TMDB)
- **Déploiement** : Vercel

## Architecture

```
src/
├── api/                # client TMDB (axios + endpoints)
├── components/         # Hero, MovieCard, SearchBar, skeletons
├── composables/        # useTrailerCache (cache global trailers)
├── stores/             # favorites (Pinia + localStorage)
├── views/              # HomeView, DetailView, FavoritesView
├── router/             # routing avec lazy-loading des routes secondaires
├── types/              # interfaces TypeScript pour les données TMDB
└── assets/             # CSS global, palette
```

## Choix techniques notables

- **Cache global des trailers** : un composable réutilisable mémoïse les requêtes vidéos TMDB, évitant de re-fetcher au survol répété d'une même carte. Les requêtes en cours sont également déduplicquées (mécanisme `inFlight`).

- **Délai de 600ms avant autoplay** : évite de spammer l'API YouTube lors de survols furtifs. Si l'utilisateur quitte la carte avant la fin du délai, aucune requête n'est lancée.

- **Pinia avec style Composition API** : usage moderne de `defineStore` avec `setup()` au lieu du style `state/actions/getters`. Persistance localStorage transparente via `watch` profond.

- **Watch providers légaux uniquement** : intégration de l'endpoint `/movie/{id}/watch/providers` de TMDB pour rediriger vers les plateformes officielles (Netflix, Prime Video, etc.). Aucun streaming pirate, aucune violation de copyright.

- **Iframes YouTube avec `pointer-events: none`** : permet au clic de passer à travers l'iframe pour atteindre le RouterLink en dessous, tout en laissant le trailer jouer en arrière-plan.

## Installation locale

```bash
git clone https://github.com/carlos-ky/moviefinder.git
cd moviefinder
npm install

# Créer .env.local à la racine avec :
# VITE_TMDB_API_KEY=votre_clé_tmdb

npm run dev
```

Obtenir une clé API TMDB gratuite : https://www.themoviedb.org/settings/api

## Auteur

**Carlos KY** — Frontend Developer
[Portfolio](https://portfolio-flame-chi-66.vercel.app/) · [GitHub](https://github.com/carlos-ky)

## Licence

MIT — Données fournies par [TMDB](https://www.themoviedb.org/), utilisées selon leurs conditions d'utilisation.