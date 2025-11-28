<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="close"
  >
    <div class="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg" @click.stop>
      <h2 class="text-lg font-semibold mb-4">
        Bayi Grafik Raporu – ID: {{ id }}
      </h2>

      <!-- İçerik -->
      <div class="space-y-4 max-h-full overflow-y-auto">
        <LoadingComponent v-if="loading" />

        <div v-else>
            <h3 class="font-medium text-blue-600 mt-4">
            Kısa Dönem Satış Raporu
          </h3>
          <section>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
              <div
                v-for="item in statCards"
                :key="item.key"
                class="card p-4 rounded-xl shadow bg-white"
              >
                <div class="text-gray-500 text-lg">{{ item.label }}</div>
                <div class="text-2xl font-bold">
                  {{ $formatCurrency(sonRapor.data[item.key]) }}
                </div>
              </div>
            </div>
          </section>
          <h3 class="font-medium text-blue-600">Aylık Rapor</h3>
          <div>
            <LineChart
              chart-title="Aylık Satış Performansı"
              :categories="ayraporCategories"
              :series="ayraporSeries"
            />
          </div>
        </div>
      </div>

      <!-- Butonlar -->
      <div class="mt-6 flex justify-end gap-2">
        <button
          @click="close"
          class="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
        >
          Kapat
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import LoadingComponent from "@/components/LoadingComponent.vue";
import LineChart from "@/components/LineChart.vue";

const authStore = useAuthStore();

const props = defineProps({
  visible: { type: Boolean, default: false },
  id: { type: [String, Number], required: true },
});

const emit = defineEmits(["close"]);

const statCards = [
  { key: "dun", label: "Dün" },
  { key: "bugun", label: "Bugün" },
  { key: "son_hafta", label: "Son Hafta" },
  { key: "son_ay", label: "Son Ay" },
];

const aylikRapor = ref(null);
const sonRapor = ref(null);
const loading = ref(false);

const ayraporCategories = ref([]);
const ayraporSeries = ref([]);

const close = () => {
  emit("close");
};

// Modal açıldığında API istekleri çalışır
watch(
  () => props.visible,
  async (isVisible) => {
    if (!isVisible) return;

    loading.value = true;
    aylikRapor.value = null;
    sonRapor.value = null;

    try {
      const bayi_id = props.id;

      const [aylik, son] = await Promise.all([
        axios.post(`${authStore.token}/bayiayrapor`, { bayi_id }),
        axios.post(`${authStore.token}/bayisonrapor`, { bayi_id }),
      ]);

      aylikRapor.value = aylik.data.data;
      sonRapor.value = son.data;

      ayraporCategories.value = aylikRapor.value.map((item) => item.name);
      ayraporSeries.value = [
        {
          name: "Aylık Performans",
          data: aylikRapor.value.map((item) => item.value),
        },
      ];
    } catch (err) {
      console.error("Rapor alınamadı:", err);
    } finally {
      loading.value = false;
    }
  }
);
</script>
