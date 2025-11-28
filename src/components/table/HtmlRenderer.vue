<template>
  <div class="relative max-w-xs" ref="trigger" @click="togglePopover">
    <!-- Truncate edilmiş text -->
    <span 
      class="block truncate cursor-pointer" 
      v-html="value">
    </span>

    <!-- Popover (fixed konumlu) -->
    <div 
      v-if="open"
      :style="popoverStyle"
      class="fixed z-[9999] bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-4 py-3 shadow-xl w-72">
      <div class="flex justify-between items-start">
        <div class="whitespace-pre-wrap break-words">{{ value }}</div>
        <button @click.stop="open=false" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
defineProps(['value', 'rowData', 'rowSettings', 'column']);

const open = ref(false);
const trigger = ref(null);
const popoverStyle = ref({});

const togglePopover = async () => {
  open.value = !open.value;

  if (open.value) {
    await nextTick();
    // trigger'ın koordinatlarını al
    const rect = trigger.value.getBoundingClientRect();
    popoverStyle.value = {
      top: `${rect.bottom + window.scrollY + 8}px`,
      left: `${rect.left + rect.width / 2 - 144}px`, // 144 = w-72/2
    };
  }
};
</script>
