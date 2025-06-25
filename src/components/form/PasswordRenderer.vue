<template>
  <div class="relative !p-0 !m-0 border-none">
    <input
      :type="isVisible ? 'text' : 'password'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full border border-gray-300 rounded px-3 py-2 pr-10"
      :placeholder="placeholder"
    />

    <button
      type="button"
      @click="toggleVisibility"
      class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
      tabindex="-1"
    >
      <svg
        v-if="isVisible"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7 1.015-2.366 2.903-4.376 5.295-5.4m3.005-.6c.86-.27 1.78-.42 2.7-.42 5 0 9.27 3.11 11 7a10.97 10.97 0 01-4.28 5.4M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>

      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3l18 18M10.477 10.477A2.993 2.993 0 0012 15a3 3 0 002.828-1.938M6.228 6.228A9.955 9.955 0 003 12c1.73 3.89 6 7 11 7 1.3 0 2.55-.2 3.725-.575M16.24 7.76a9.955 9.955 0 014.76 4.24"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: String,
  placeholder: String
})

defineEmits(['update:modelValue'])

const isVisible = ref(false)

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}
</script>
