<template>
  <transition name="fade-scale">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click.self="onCancel"
    >
      <div class="bg-white rounded-xl p-6 w-96 shadow-xl text-center">
        <p class="text-gray-700 text-lg mb-6">{{ message }}</p>
        <div class="flex justify-center gap-4">
          <button @click="onConfirm" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Evet</button>
          <button @click="onCancel" class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors">Hayır</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  message: String,
})
const emit = defineEmits(['confirm', 'cancel'])

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
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
