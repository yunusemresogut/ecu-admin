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
  tableName: "users",
  create: "kullanicilar",
  update: "kullanicilar",
  display_name: "Kullanıcılar",
});

const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
  showGraphButton: true,
})
</script>