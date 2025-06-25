<template>
    <span v-if="value">{{ $formatCurrency(value) }} TL</span>
</template>
<script setup>
defineProps(['value', 'rowData', 'rowSettings', 'column']);
</script>