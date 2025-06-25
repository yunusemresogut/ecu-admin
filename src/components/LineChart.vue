<template>
  <div class="bg-white p-4 rounded shadow">
    <Line :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// Props
const props = defineProps({
  chartTitle: String,
  categories: Array,
  columns: Array
})

const colorPalette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
  "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ab",
  "#6b5b95", "#feb236", "#d64161", "#ff7b25", "#009688",
  "#3f51b5", "#795548", "#607d8b", "#f44336", "#2196f3"
];

const datasets = props.columns.map((col, index) => ({
  label: col[0],
  data: col.slice(1),
  borderColor: colorPalette[index % colorPalette.length], // renkleri sırayla ver
  backgroundColor: 'transparent',
  tension: 0.4
}))

const data = {
  labels: props.categories,
  datasets
}

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: {
      display: true,
      text: props.chartTitle || 'Grafik'
    }
  }
}
</script>