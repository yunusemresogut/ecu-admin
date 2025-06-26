<template>
  <TableComponent
    :tableInfo="tableInfo"
    :settings="settings"
    :filters="filters"
  />
</template>

<script setup>
import { ref } from "vue";
import TableComponent from "@/components/TableComponent.vue";

const tableInfo = ref({
  tableName: "uygulama_sekli",
  create: "uygulama-sekli",
  update: "uygulama-sekli",
  display_name: "Uygulama Şekli",
});

const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
})
</script>