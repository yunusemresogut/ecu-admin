<template>
  <div v-if="parsedFiles.length" class="space-y-1">
    <div
      v-for="(file, index) in parsedFiles"
      :key="index"
      class="flex items-center justify-between gap-2 bg-gray-200 p-2 rounded hover:bg-gray-300"
    >
      <span class="truncate text-sm text-gray-800 w-60">{{ file.file_name }}</span>

      <button
        @click="downloadFile(file)"
        class="text-blue-600 hover:underline text-sm hover:text-blue-800 hover:bg-blue-100 rounded p-1"
      >
        <Download />
      </button>
    </div>
  </div>
  <div v-else class="text-sm text-gray-500 italic">Dosya yok</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['value'])

const BASE_URL = import.meta.env.VITE_BASE_UPLOAD_URL

// Veriyi parse et (güvenli bir şekilde)
const parsedFiles = computed(() => {
  try {
    const json = JSON.parse(props.value || '[]')
    return Array.isArray(json) ? json : []
  } catch (e) {
    return []
  }
})

// İndirme fonksiyonu
const downloadFile = (file) => {
  const url = `${BASE_URL}${file.disk}/${file.destination_path}${file.file_name}`
  window.open(url, '_blank')
}
</script>
