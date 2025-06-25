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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
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
