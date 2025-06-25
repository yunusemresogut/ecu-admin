<template>
    <div class="json-container">
      <span>{{ formattedValues }}</span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    value: {
      type: [String, Number, Boolean, Array, Object],
      required: true,
    },
  });
  
  const excludedFields = ['user_id', 'created_at', 'id', 'own_id', 'state', 'updated_at'];
  
  const formatValues = (val) => {
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
  
      if (Array.isArray(parsed)) {
        return parsed.join(' | '); // Array ise değerleri | ile ayır
      } else if (typeof parsed === 'object' && parsed !== null) {
        return Object.entries(parsed)
          .filter(([key]) => !excludedFields.includes(key))
          .map(([_, value]) => value)
          .join(' | '); // Objedeki değerleri al, | ile ayır
      }
  
      return val?.toString() || '-';
    } catch {
      return val?.toString() || '-';
    }
  };
  
  const formattedValues = computed(() => formatValues(props.value));
  </script>
  
  <style scoped>
  .json-container {
  display: flex;
  white-space: nowrap;
  overflow: auto;
  text-overflow: ellipsis;
}
  </style>
  