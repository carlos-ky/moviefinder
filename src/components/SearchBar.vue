<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

let debounceTimer: number | undefined

function handleInput() {
  emit('update:modelValue', localValue.value)
  clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    emit('search', localValue.value)
  }, 400)
}

function handleClear() {
  localValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<template>
  <div class="relative max-w-2xl mx-auto">
    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted pointer-events-none">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="7"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </div>
    <input
      v-model="localValue"
      @input="handleInput"
      type="text"
      placeholder="Rechercher un film, une série…"
      class="w-full bg-cinema-surface border border-cinema-border rounded-lg pl-12 pr-12 py-4 text-cinema-text placeholder-cinema-muted focus:outline-none focus:border-cinema-accent transition"
    />
    <button
      v-if="localValue"
      @click="handleClear"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-cinema-text transition"
      aria-label="Effacer"
    >
      ✕
    </button>
  </div>
</template>