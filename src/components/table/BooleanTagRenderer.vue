<template>
  <span
    class="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium capitalize"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps(['value', 'rowData', 'rowSettings', 'column'])

const statusMap = {
  true: { text: 'Aktif', class: 'bg-green-100 text-green-800' },
  false: { text: 'Pasif', class: 'bg-red-100 text-red-800' },
  null: { text: 'Boş', class: 'bg-gray-100 text-gray-800' },
  'beklemede': { text: 'Beklemede', class: 'bg-yellow-100 text-yellow-800' },
  'taslak': { text: 'Taslak', class: 'bg-gray-100 text-gray-800' },
  'iptal': { text: 'İptal', class: 'bg-red-100 text-red-800' },
  'tamamlandi': { text: 'Tamamlandı', class: 'bg-blue-100 text-blue-800' },
}

const valueKey = props.value === true ? 'true'
                : props.value === false ? 'false'
                : String(props.value).toLowerCase()

const label = statusMap[valueKey]?.text || String(props.value)
const badgeClass = statusMap[valueKey]?.class || 'bg-gray-100 text-gray-700'
</script>
