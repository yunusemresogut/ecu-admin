<template>
  <div class="flex flex-col gap-2">
    <!-- Mevcut dosya -->
    <div v-if="existingFiles.length" class="mb-2">
      <label class="block text-sm font-medium text-gray-700 mb-1">Mevcut Dosya:</label>
      <ul class="list-disc list-inside">
        <li v-for="(file, idx) in JSON.parse(existingFiles)" :key="idx" class="flex items-center gap-2">
          <a :href="baseUrl + file.disk + '/' + file.destination_path + file.file_name" download target="_blank" class="text-blue-600 hover:underline">{{ file.file_name }}</a>
          <button
            type="button"
            @click="removeExistingFile(idx)"
            class="text-red-500 hover:text-red-700 text-sm"
          >
            Sil
          </button>
        </li>
      </ul>
    </div>

    <!-- Yeni dosya ekleme -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Dosya Ekle:</label>
      <input type="file" @change="handleFileAdd" class="border rounded p-2 w-full" />
    </div>

    <!-- Yeni eklenen dosya -->
    <div v-if="internalFiles.length" class="mt-2">
      <label class="block text-sm font-medium text-gray-700 mb-1">Eklenecek Dosya:</label>
      <ul class="list-disc list-inside">
        <li v-for="(file, idx) in internalFiles" :key="idx" class="flex items-center gap-2">
          <span>{{ file.name }}</span>
          <button
            type="button"
            @click="removeInternalFile(idx)"
            class="text-red-500 hover:text-red-700 text-sm"
          >
            Kaldır
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [] // Backend’den gelen dosyalar
  }
});

const baseUrl = import.meta.env.VITE_BASE_UPLOAD_URL;

const emit = defineEmits(["update:modelValue"]);

const existingFiles = ref([]);
const internalFiles = ref([]); // tek dosya array

watch(
  () => props.modelValue,
  (val) => {
    existingFiles.value = val || [];
  },
  { immediate: true }
);

// Yeni dosya ekleme (tek dosya)
const handleFileAdd = (event) => {
  const file = event.target.files[0];
  internalFiles.value = file ? [file] : [];
  // Yeni dosya seçilince eski dosyayı otomatik temizle
  existingFiles.value = [];
  updateValue();
};

// Internal dosya kaldır
const removeInternalFile = (idx) => {
  internalFiles.value.splice(idx, 1);
  updateValue();
};

// Mevcut dosya kaldır
const removeExistingFile = (idx) => {
  existingFiles.value.splice(idx, 1);
  updateValue();
};

// Emit edilen değer backend'e gidecek
const updateValue = () => {
  emit("update:modelValue", {
    existing: existingFiles.value, // mevcut dosya bilgisi
    new: internalFiles.value // yeni dosya (tek File objesi)
  });
};
</script>
