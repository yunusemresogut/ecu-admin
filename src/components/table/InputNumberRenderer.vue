<template>
    <div v-if="rowSettings?.editable" style="max-width: 4rem;">
        <!-- <InputNumber v-model="rowData[column]" inputId="withoutgrouping" :useGrouping="false" fluid /> -->
    </div>
    <span v-else>{{ value }}</span>
</template>
<script setup>
defineProps(['value', 'rowData', 'rowSettings', 'column']);
</script>