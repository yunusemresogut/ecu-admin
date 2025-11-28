<template>
  <div class="bg-white p-4 rounded shadow h-80">
    <Bar :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Chart.js modülleri
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Props
const props = defineProps({
  chartTitle: String,
  categories: Array, // X ekseni -> bayi_adi
  series: Array      // [{ name: "...", data: [...] }]
});

const colorPalette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
  "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ab",
];

// Chart.js dataset formatına çevirme
const datasets = props.series.map((item, index) => ({
  label: item.name,
  data: item.data,
  backgroundColor: colorPalette[index % colorPalette.length],
}));

// Chart data
const data = {
  labels: props.categories,
  datasets,
};

// Chart options
const options = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" },
    title: {
      display: true,
      text: props.chartTitle || "Bar Grafik",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>
