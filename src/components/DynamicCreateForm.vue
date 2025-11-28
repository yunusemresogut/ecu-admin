<template>
  <div class="p-4">
    <LoadingComponent v-if="loading" />
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">
        {{ tableInfo.display_name || "Form" }} Oluştur
      </h1>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(col, index) in columns" :key="index">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ col.display_name }}
            </label>

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

            <ul
              v-if="formErrors[col.name]"
              class="flex flex-wrap gap-x-2 text-sm text-red-600 mt-1"
            >
              <li
                v-for="(err, idx) in formErrors[col.name]"
                :key="idx"
                class="after:content-[''] last:after:content-none"
              >
                {{ err }}
              </li>
            </ul>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import formComponents from "@/components/form";
import { useAuthStore } from "@/stores/auth";
import LoadingComponent from "./LoadingComponent.vue";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";

const toast = useToast();
const authStore = useAuthStore();
const props = defineProps(["tableName"]);
const route = useRoute();
const router = useRouter();

const tableName = props.tableName || "default_table_name";
const columns = ref([]);
const tableInfo = ref({});
const formData = ref({});
const formErrors = ref({});
const loading = ref(false);

const getDatas = async () => {
  try {
    loading.value = true;
    let params = {
      column_set_id: authStore.userDataAdmin.auths.tables[tableName].creates[0],
    };

    const res = await axios.post(
      `${authStore.token}/tables/${tableName}/create`,
      {
        params: JSON.stringify(params),
      }
    );
    tableInfo.value = res.data?.data?.table_info;
    const rawColumns =
      res.data?.data?.column_set?.column_arrays?.[0]?.columns || {};

    const loadedColumns = await Promise.all(
      Object.entries(rawColumns).map(async ([key, col]) => {
        formData.value[col.name] = getInitialValue(col.gui_type_name);

        if (
          [
            "select",
            "select:static",
            "multiselect",
            "multiselect:static",
          ].includes(col.gui_type_name)
        ) {
          let formData = new FormData();
          formData.append("search", "***");
          formData.append("limit", "3000");
          try {
            const selectRes = await axios.post(
              `${authStore.token}/tables/${tableName}/getSelectColumnData/${col.name}`,
              formData
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

        return col;
      })
    );

    columns.value = loadedColumns;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getDatas();
});

const handleInputChange = (field, value) => {
  formData.value[field] = value;
  if (formErrors.value[field]) {
    delete formErrors.value[field];
  }
};

const handleSubmit = async () => {
  try {
    formErrors.value = {}; // önceki hataları temizle

    console.log(formData.value);
    const formDatas = new FormData();
    for (const [key, value] of Object.entries(formData.value)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formDatas.append(key, JSON.stringify(value));
        } else {
          formDatas.append(key, value);
        }
      }
    }

    formDatas.append(
      "column_set_id",
      authStore.userDataAdmin.auths.tables[tableName].creates[0]
    );

    console.log(formDatas);

    const response = await axios.post(
      `${authStore.token}/tables/${tableName}/store`,
      formDatas
    );

    if (response?.data?.data?.errors) {
      formErrors.value = response.data.data.errors;
      toast.error("Form hataları var. Lütfen kontrol edin.");
      return;
    }

    toast.success("Form başarıyla kaydedildi!");

    const currentPath = route.path;
    const parts = currentPath.split("/");
    const tn = parts[1];

    router.push(`/${tn}`);
  } catch (error) {
    if (error.status === 500) {
      toast.error("Veritabanı ya da sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.");
      return;
    } else {
      toast.error("Bilinmeyen bir hata oluştu.");
    }
    console.error(error);
  }
};

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

function getInitialValue(type) {
  switch (type) {
    case "boolean":
    case "boolean:fastchange":
      return 0;
    case "multiselect":
    case "multiselect:static":
      return [];
    case "json":
      return {};
    default:
      return "";
  }
}
</script>
