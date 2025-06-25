<template>
    <div v-if="rowSettings?.largeText" :title="value">{{
        value }}</div>
    <span v-else>{{ value }}</span>
</template>
<script setup>
defineProps(['value', 'rowData', 'rowSettings', 'column']);
</script>