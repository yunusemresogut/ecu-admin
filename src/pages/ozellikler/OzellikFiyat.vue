<template>
<LoadingComponent v-if="loading" />
  <div v-else class="p-6 space-y-6">
    <!-- Başlık -->
    <h1 class="text-2xl font-bold">Özellik Fiyat Sayfası</h1>

    <!-- Yeni Fiyat Aralığı Butonu -->
    <button
      @click="addRange"
      class="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-2xl shadow hover:bg-sky-700 transition"
    >
      <Plus class="w-4 h-4" />
      Yeni Fiyat Aralığı
    </button>

    <!-- Fiyat Aralıkları -->
    <div class="space-y-4">
      <div
        v-for="(item, index) in fiyatAraliklari"
        :key="index"
        class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl shadow-sm"
      >
        <!-- Başlık -->
        <span class="text-sm font-semibold text-gray-600 w-32">
          {{ index + 1 }}. Fiyat Aralığı
        </span>

        <!-- Inputlar -->
        <div class="flex flex-col gap-1">
            <label>Fiyat 1</label>
        <input
          type="number"
          min="0"
          v-model.number="item.fiyat_1"
          placeholder="Fiyat 1"
          class="w-28 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400"
        />
        </div>
        <div class="flex flex-col gap-1">
        <label>Fiyat 2</label>
        <input
          type="number"
          min="0"
          v-model.number="item.fiyat_2"
          placeholder="Fiyat 2"
          class="w-28 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400"
        />
        </div>
        <div class="flex flex-col gap-1">
        <label>Oran %</label>
        <input
          type="number"
          min="0"
          max="100"
          v-model.number="item.oran"
          placeholder="Oran %"
          class="w-28 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400"
        />
        </div>

        <!-- Sil Butonu -->
        <button
          @click="removeRange(index)"
          class="ml-auto p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    </div>

    <button
    v-show="fiyatAraliklari.length > 0"
      @click="updateData"
      class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-2xl shadow hover:bg-emerald-700 transition"
    >
        Güncelle
    </button>

    <!-- JSON Görünümü -->
    <!-- <div class="mt-6">
      <h2 class="font-semibold mb-2">JSON Data</h2>
      <pre class="bg-gray-900 text-green-400 text-sm p-4 rounded-lg">
{{ JSON.stringify(fiyatAraliklari, null, 2) }}
      </pre>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Plus, Trash2 } from "lucide-vue-next";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import LoadingComponent from "../../components/LoadingComponent.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const authStore = useAuthStore();

// fiyat aralıklarını tutan array
const fiyatAraliklari = ref([]);
const loading = ref(false);

// Sayfa açılınca endpoint'ten gelen datayı alıyormuş gibi simüle edelim
onMounted(() => {
    getData();
});

// Yeni aralık ekleme
const addRange = () => {
  fiyatAraliklari.value.push({ fiyat_1: 0, fiyat_2: 0, oran: 0 });
};

// Aralık silme
const removeRange = (index) => {
  fiyatAraliklari.value.splice(index, 1);
};

const getData = async () => {
    try {
    loading.value = true;

    const params = {
      column_set_id: authStore.userDataAdmin.auths.tables["fiyat_araliklar"].edits[0],
    };

    const res = await axios.post(
      `${authStore.token}/tables/fiyat_araliklar/1/edit`,
      {
        params: JSON.stringify(params),
      }
    );
    console.log(res.data)
    fiyatAraliklari.value = JSON.parse(res.data?.data?.record?.fiyatlar_json || '[]');
    } catch (error) {
      toast.error("Veri alınırken bir hata oluştu.");
    } finally {
      loading.value = false;
    }
};

const updateData = async () => {
    try {
    loading.value = true;

    const formDatas = new FormData();
    formDatas.append(
      "column_set_id",
      authStore.userDataAdmin.auths.tables["fiyat_araliklar"].edits[0]
    );
    formDatas.append("fiyatlar_json", JSON.stringify(fiyatAraliklari.value));

    const res = await axios.post(
      `${authStore.token}/tables/fiyat_araliklar/1/update`,
        formDatas
    );
    if (res.data?.data.message === 'success') {
        toast.success("Fiyat aralıkları başarıyla güncellendi.");
        getData();
    } else {
        toast.error("Güncelleme başarısız oldu.");
    }
    console.log(res)
    } catch (error) {
      toast.error("Veri alınırken bir hata oluştu.");
    } finally {
      loading.value = false;
    }
};
</script>
