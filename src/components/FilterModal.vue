<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="onCancel"
  >
    <div class="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg" @click.stop>
      <h2 class="text-lg font-semibold mb-4">Filtrele</h2>

      <div class="space-y-4 max-h-[60vh] overflow-y-auto">
        <div v-for="col in columns" :key="col.name" class="flex flex-col gap-1">
          <label class="font-medium">{{ col.display_name }}</label>

          <component
            :is="getInputComponent(col.gui_type_name)"
            :model-value="formData[col.name]"
            @update:modelValue="(val) => handleInputChange(col.name, val)"
            :options="col.options || []"
            :placeholder="col.display_name"
            class="w-full border rounded p-2"
            :class="{
              'border-red-500': formErrors[col.name],
              'border-gray-300': !formErrors[col.name],
            }"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
        >
          Temizle
        </button>
        <button
          @click="onCancel"
          class="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
        >
          Vazgeç
        </button>
        <button
          @click="applyFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Uygula
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import formComponents from "@/components/form";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const props = defineProps(["columns", "visible", "tableName"]);
const emit = defineEmits(["close", "apply", "filterCount"]);

const formData = ref({});
const formErrors = ref({});

const isOptionsLoading = ref(false);

const getInputComponent = (type) => {
  switch (type) {
    case "string":
      return formComponents.StringRenderer;
    case "boolean":
    case "boolean:fastchange":
      return formComponents.BooleanTagRenderer;
    case "numeric":
      return formComponents.InputNumberRenderer;
    case "select":
    case "select:static":
      return formComponents.SelectRenderer;
    case "date":
      return formComponents.DateRenderer;
    case "datetime":
      return formComponents.DateTimeRenderer;
    case "files":
      return formComponents.FilesRenderer;
    case "text":
      return formComponents.TextareaRenderer;
    case "multiselect":
    case "multiselect:static":
      return formComponents.MultiSelectRenderer;
    case "json":
      return formComponents.JsonRenderer;
    case "money:tl":
      return formComponents.MoneyRenderer;
    case "phone":
      return formComponents.PhoneRenderer;
    case "password":
      return formComponents.PasswordRenderer;
    default:
      return formComponents[type] || formComponents.DefaultRenderer || "span";
  }
};

const handleInputChange = (field, value) => {
  formData.value[field] = value;
  if (formErrors.value[field]) {
    delete formErrors.value[field];
  }
};

const onCancel = () => {
  emit("close");
};

const applyFilters = () => {
  const result = {};

  const columnsArray = Array.isArray(props.columns)
    ? props.columns
    : Object.values(props.columns);

  if (!columnsArray.length) return;

  for (const key in formData.value) {
    const val = formData.value[key];
    const column = columnsArray.find((c) => c.name === key);

    if (!column) continue;

    if (
      val !== "" &&
      val !== null &&
      !(Array.isArray(val) && val.length === 0)
    ) {
      let filterValue = val;

      if (["select", "select:static"].includes(column.gui_type_name)) {
        filterValue = [val];
      }

      if (
        ["multiselect", "multiselect:static"].includes(column.gui_type_name)
      ) {
        filterValue = Array.isArray(val) ? val : [val];
      }

      result[key] = {
        type: 1,
        guiType: column.gui_type_name,
        filter: filterValue,
        columnName: column.display_name,
      };
    }
  }

  emit("apply", result);
  emit("filterCount", Object.keys(result).length);
};

const clearFilters = () => {
  for (const key in formData.value) {
    formData.value[key] = null;
  }
  formErrors.value = {};
  emit("apply", null);
  emit("filterCount", 0);
  emit("close");
};

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) return;

    const columnsArray = Array.isArray(props.columns)
      ? props.columns
      : Object.values(props.columns);

    if (!columnsArray.length) return;

    isOptionsLoading.value = true;

    const firstCol = columnsArray[0];
    const match = authStore.userDataAdmin?.auths?.tables;

    for (const table in match) {
      const tableCols = match[table]?.columns || [];
      if (tableCols.find((c) => c.name === firstCol?.name)) {
        props.tableName = table;
        break;
      }
    }

    await Promise.all(
      columnsArray.map(async (col) => {
        if (
          [
            "select",
            "select:static",
            "multiselect",
            "multiselect:static",
          ].includes(col.gui_type_name)
        ) {
          let formDataObj = new FormData();
          formDataObj.append("search", "***");
          formDataObj.append("limit", "2000");

          try {
            const selectRes = await axios.post(
              `${authStore.token}/tables/${props.tableName}/getSelectColumnData/${col.name}`,
              formDataObj
            );
            const results = selectRes.data?.results || [];
            col.options = results.map((item) => ({
              label: item.text,
              value: item.id,
            }));
          } catch (err) {
            console.warn(`Select verisi alınamadı: ${col.name}`, err);
            col.options = [];
          }
        }
      })
    );

    isOptionsLoading.value = false;
  }
);
</script>
