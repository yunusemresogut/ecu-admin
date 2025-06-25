<template>
    <span>{{ value }}</span>
</template>
<script setup>
defineProps(['value', 'rowData', 'rowSettings', 'column']);
</script>