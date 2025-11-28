<template>
  <transition name="fade-scale">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click.self="onCancel"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-[600px] shadow-xl text-center"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <p class="text-gray-700 text-lg mb-4">{{ title }}</p>

        <label
          class="border-2 border-dashed border-gray-300 rounded-xl p-8 block cursor-pointer transition-colors"
          :class="{ 'bg-gray-100': isDragging }"
        >
          <input
            type="file"
            class="hidden"
            @change="handleFileSelect"
          />
          <div v-if="!selectedFile">
            <p class="text-gray-500">
              Dosyayı buraya sürükleyin ya da <span class="text-blue-500 underline">tıklayın</span>
            </p>
            <p class="text-sm text-gray-400 mt-2">
              İzin verilen türler: {{ allowedExtensions.join(', ') }}<br />
              Max: {{ maxSizeMB }} MB
            </p>
          </div>
          <div v-else class="mt-2 text-gray-700">
            <p><strong>Seçilen:</strong> {{ selectedFile.name }}</p>
            <p class="text-sm text-gray-500">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
        </label>

        <div class="flex justify-center gap-4 mt-6">
          <button
            @click="onConfirm"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            :disabled="!selectedFile"
          >
            Yükle
          </button>
          <button
            @click="onCancel"
            class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            İptal
          </button>
        </div>

        <p v-if="errorMessage" class="text-sm text-red-500 mt-4">{{ errorMessage }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Dosya Yükle'
  },
  maxSizeMB: {
    type: Number,
    default: 50
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const allowedExtensions = [
  '.cod', '.slave', '.slv', '.bin', '.mpc', '.unq', '.dec', '.mmf',
  '.erp', '.zip', '.rar', '.slx', '.txt', '.g3fax'
]

const isDragging = ref(false)
const selectedFile = ref(null)
const errorMessage = ref('')

const getExtension = (filename) => {
  return '.' + filename.split('.').pop().toLowerCase()
}

const validateFile = (file) => {
  if (!file) return

  console.log(file.name)
  console.log(getExtension(file.name))
  const ext = getExtension(file.name)
  const maxSizeBytes = props.maxSizeMB * 1024 * 1024

  console.log(allowedExtensions.includes(ext))
  console.log('Uzantı:', ext)
  if (!allowedExtensions.includes(ext)) {
    errorMessage.value = `Geçersiz dosya türü. Sadece şu uzantılara izin verilir: ${allowedExtensions.join(', ')}`
    selectedFile.value = null
    return
  }

  if (file.size > maxSizeBytes) {
    errorMessage.value = `Dosya ${props.maxSizeMB} MB'den büyük olamaz.`
    selectedFile.value = null
    return
  }

  selectedFile.value = file
  errorMessage.value = ''
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  validateFile(file)
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  isDragging.value = false
  validateFile(file)
}

const onConfirm = () => {
  if (!selectedFile.value) return
  emit('confirm', selectedFile.value)
  selectedFile.value = null
}

const onCancel = () => {
  selectedFile.value = null
  errorMessage.value = ''
  emit('cancel')
}
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
