<template>
    <div class="flex flex-col overflow-y-auto max-h-24 gap-1">
        <div class="text-nowrap bg-blue-500 px-2 py-1 rounded-lg text-white text-center" v-for="v in JSON.parse(value)" :key="v">{{ v.display }}</div>
        <div class="text-nowrap bg-red-500 px-2 py-1 rounded-lg text-white text-center" v-if="value === null">Yok</div>
    </div>
</template>
<script setup>

defineProps(['value', 'rowData', 'rowSettings', 'column']);
</script>