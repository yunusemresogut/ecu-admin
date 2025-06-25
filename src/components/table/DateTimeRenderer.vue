<template>
    <div :title="$dateFormatterTime(value)">
        {{ $dateFormatterTime(value) }}
    </div>
</template>
<script setup>
defineProps(['value', 'rowData', 'rowSettings', 'column']);
</script>