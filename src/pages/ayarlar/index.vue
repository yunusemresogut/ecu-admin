<template>
  <LoadingComponent v-if="loading" />
  <div v-else class="max-w-6xl mx-auto mt-10 space-y-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Ayarlar</h1>

    <div
      v-for="setting in settings"
      :key="setting.id"
      class="p-4 rounded-2xl bg-white shadow-md border border-gray-200 hover:shadow-lg transition duration-200"
    >
      <div class="mb-2">
        <p class="text-base text-gray-600 font-semibold">{{ setting.name }}</p>
        <p class="text-sm text-gray-400">{{ setting.description }}</p>
      </div>

      <input
        type="text"
        v-model="setting.value"
        @blur="updateSetting(setting)"
        class="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
      />
    </div>
    <p class="text-xs text-gray-400 mt-1 italic">
        *Herhangi bir değeri değiştirdikten sonra kutudan çıkınca otomatik kaydedilir.
      </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from "vue-toastification";
import LoadingComponent from "@/components/LoadingComponent.vue";

const authStore = useAuthStore()
const toast = useToast();
const settings = ref([])
const loading = ref(false)

const params = ref({
  page: 1,
  limit: 20,
  sorts: {},
  filters: {},
  column_array_id: authStore.userDataAdmin.auths.tables['settings'].lists[0],
  column_array_id_query: authStore.userDataAdmin.auths.tables['settings']?.lists?.[0],
})

onMounted(async () => {
  try {
    loading.value = true
    const response = await axios.post(
      `${authStore.token}/tables/settings`,
      {
        params: JSON.stringify(params.value),
      }
    )
    settings.value = response.data.data.records
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

const updateSetting = async (setting) => {
  const payload = {
    value: setting.value,
    column_set_id: authStore.userDataAdmin.auths.tables['settings']?.edits?.[0],
    id: setting.id,
    in_form_column_name: 'value',
    single_column: 'value',
  }

  try {
    const response = await axios.post(`${authStore.token}/tables/settings/${setting.id}/update`, payload)
    // if (response.data.data.message === 'success') {
    //   toast.success(`Ayar "${setting.name}" başarıyla güncellendi.`);
    // } else {
    //   toast.error(`Ayar "${setting.name}" güncellenemedi:`, response.data.data.message);
    // }
  } catch (err) {
    toast.error("Bir hata oluştu." + err);
  }
}
</script>