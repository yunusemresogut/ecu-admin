<template>
  <UpdateComponent
    :tableName="tableName"
  />
</template>

<script setup>
import { ref } from "vue";
import UpdateComponent from "@/components/DynamicUpdateForm.vue";

const tableName = ref("yakıt_türü");
</script>