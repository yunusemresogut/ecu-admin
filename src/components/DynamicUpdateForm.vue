<template>
  <div class="p-4">
    <LoadingComponent v-if="loading" />
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">{{ tableInfo.display_name || "Form" }} Düzenle</h1>
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

            <ul v-if="formErrors[col.name]" class="flex flex-wrap gap-x-2 text-sm text-red-600 mt-1">
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
          <button type="submit" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
const id = route.params.id;
const columns = ref([]);
const tableInfo = ref({});
const formData = ref({});
const formErrors = ref({});
const loading = ref(false);


const getDatas = async () => {
  try {
    loading.value = true;

    const params = {
      column_set_id: authStore.userData.auths.tables[tableName].edits[0],
    };

    const res = await axios.post(`${authStore.token}/tables/${tableName}/${id}/edit`, {
      params: JSON.stringify(params),
    });

    tableInfo.value = res.data?.data?.table_info;
    const rawColumns = res.data?.data?.column_set?.column_arrays?.[0]?.columns || {};
    const record = res.data?.data?.record || {}; // <- record verisini aldık

    const loadedColumns = await Promise.all(
      Object.entries(rawColumns).map(async ([key, col]) => {
        // 1. Başlangıç değeri: boş ya da uygun default
        let initial = getInitialValue(col.gui_type_name);

        // 2. Record verisi varsa, buna göre set edelim
        const val = record[col.name];

        if (val !== undefined && val !== null) {
          if (["select", "select:static"].includes(col.gui_type_name)) {
            // val = [{ source: 55, display: "Samsun" }] gibi -> sadece source değerini al
            if (Array.isArray(val) && val[0]?.source !== undefined) {
              initial = val[0].source;
            }
          } else if (["multiselect", "multiselect:static"].includes(col.gui_type_name)) {
            // val = [{ source: 1 }, { source: 2 }] gibi -> source'ları array olarak al
            if (Array.isArray(val)) {
              initial = val.map((item) => item.source ?? item);
            }
          } else {
            initial = val;
          }
        }

        // 3. formData'ya set et
        formData.value[col.name] = initial;

        // 4. Eğer select tipi ise, options'ları çek
        if (["select", "select:static", "multiselect", "multiselect:static"].includes(col.gui_type_name)) {
          let formDataObj = new FormData();
          formDataObj.append("search", "***");
          formDataObj.append("limit", "2000");

          try {
            const selectRes = await axios.post(
              `${authStore.token}/tables/${tableName}/getSelectColumnData/${col.name}`,
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

        return col;
      })
    );

    columns.value = loadedColumns;
  } catch (error) {
    console.error(error);
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

    const formDatas = new FormData();
    for (const [key, value] of Object.entries(formData.value)) {
      if (value !== undefined && value !== null) {
        let processedValue = value;

        // boolean/fastchange tipleri için kontrol
        const col = columns.value.find((c) => c.name === key);
        const isBoolean =
          col?.gui_type_name === "boolean" || col?.gui_type_name === "boolean:fastchange";

        if (isBoolean) {
          processedValue = value === true || value === 1 || value === "1" ? 1 : 0;
        }

        if (Array.isArray(processedValue)) {
          processedValue.forEach((item) => formDatas.append(key, item));
        } else {
          formDatas.append(key, processedValue);
        }
      }
    }

    formDatas.append("column_set_id", authStore.userData.auths.tables[tableName].creates[0]);

    const response = await axios.post(`${authStore.token}/tables/${tableName}/${id}/update`, formDatas);

    if (response?.data?.data?.errors) {
      formErrors.value = response.data.data.errors;
      toast.error("Form hataları var. Lütfen kontrol edin.");
      return;
    }

    toast.success("Form başarıyla kaydedildi!");
    const currentPath = route.path // örnek: "/bayiler/duzenle/96"
    const parts = currentPath.split("/") // ["", "bayiler", "duzenle", "96"]
    const tn = parts[1] // "bayiler"

    router.push(`/${tn}`)
  } catch (error) {
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
