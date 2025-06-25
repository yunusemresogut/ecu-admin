<template>
    <span v-html="value" :title="value"></span>
</template>
<script setup>
defineProps(['value', 'rowData', 'rowSettings', 'column']);
</script>