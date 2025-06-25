<template>
    <div :title="$dateFormatter(value)">
        {{ $dateFormatter(value) }}
    </div>
</template>
<script setup>
defineProps(['value', 'rowData', 'rowSettings', 'column']);
</script>