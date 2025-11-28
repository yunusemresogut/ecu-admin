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
  tableName: "hedef",
  create: "kullanici-hedefleri",
  update: "kullanici-hedefleri",
  display_name: "Kullanıcı Hedefleri",
});

const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
  showDeleteButton: true,
})
</script>