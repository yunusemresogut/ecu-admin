<template>
  <span
    v-if="badgeMap[normalizedValue]"
    class="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium capitalize"
    :class="badgeMap[normalizedValue].class"
  >
    {{ badgeMap[normalizedValue].text }}
  </span>

  <span v-else class="text-sm text-gray-800">
    {{ value }}
  </span>
</template>

<script setup>
const props = defineProps(["value", "rowData", "rowSettings", "column"])

// Normalize etmek için tüm değerleri string’e çevir
const normalizedValue = String(props.value).toLowerCase()

const badgeMap = {
  'onay bekliyor': {
    text: 'Onay Bekliyor',
    class: 'bg-yellow-100 text-yellow-800',
  },
  'reddedildi': {
    text: 'Reddedildi',
    class: 'bg-red-100 text-red-800',
  },
  'onaylandı': {
    text: 'Onaylandı',
    class: 'bg-green-100 text-green-800',
  },
  'tamamlandı': {
    text: 'Tamamlandı',
    class: 'bg-green-100 text-green-800',
  },
  'hazırlanıyor': {
    text: 'Hazırlanıyor',
    class: 'bg-blue-100 text-blue-800',
  },
}
</script>
