<template>
  <input
    ref="inputRef"
    type="text"
    :value="displayValue"
    @input="onInput"
    placeholder="gg.aa.yyyy ss:dd:ss"
    maxlength="19"
    inputmode="numeric"
    class="w-full border border-gray-300 rounded px-3 py-2"
    autocomplete="off"
  />
</template>

<script setup>
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  modelValue: String, // 'yyyy-mm-dd hh:mm:ss'
});
const emit = defineEmits(["update:modelValue"]);

const inputRef = ref(null);
const displayValue = ref("");

watch(
  () => props.modelValue,
  (val) => {
    displayValue.value = isoToDisplay(val);
  },
  { immediate: true }
);

function isoToDisplay(iso) {
  if (!iso) return "";
  // yyyy-mm-dd hh:mm:ss
  const dtParts = iso.split(" ");
  if (dtParts.length !== 2) return "";

  const [date, time] = dtParts;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) return "";

  const [y, m, d] = date.split("-");
  const [h, min, s] = time.split(":");
  return `${d}.${m}.${y} ${h}:${min}:${s}`;
}

function displayToIso(display) {
  // gg.aa.yyyy ss:mm:ss
  const parts = display.split(" ");
  if (parts.length !== 2) return "";

  const [datePart, timePart] = parts;
  const dateSegments = datePart.split(".");
  if (dateSegments.length !== 3) return "";

  const [d, m, y] = dateSegments;
  if (d.length !== 2 || m.length !== 2 || y.length !== 4) return "";

  // Saat kısmı ss:mm:ss olmalı
  const timeSegments = timePart.split(":");
  if (timeSegments.length !== 3) return "";

  const [h, min, s] = timeSegments;
  if (
    h.length !== 2 ||
    min.length !== 2 ||
    s.length !== 2
  )
    return "";

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function onInput(e) {
  let val = e.target.value;

  // Yalnızca rakam, nokta, iki nokta ve boşluk kalacak
  val = val.replace(/[^\d.: ]/g, "");

  // Tarih için nokta ekle
  if (val.length > 2 && val[2] !== ".") val = val.slice(0, 2) + "." + val.slice(2);
  if (val.length > 5 && val[5] !== ".") val = val.slice(0, 5) + "." + val.slice(5);

  // Tarih + boşluk için
  if (val.length > 10 && val[10] !== " ") val = val.slice(0, 10) + " " + val.slice(10);

  // Saat için iki nokta ekle
  if (val.length > 13 && val[13] !== ":") val = val.slice(0, 13) + ":" + val.slice(13);
  if (val.length > 16 && val[16] !== ":") val = val.slice(0, 16) + ":" + val.slice(16);

  if (val.length > 19) val = val.slice(0, 19);

  // Parçala
  const parts = val.split(" ");
  const dateParts = parts[0].split(".");
  let timeParts = parts[1] ? parts[1].split(":") : [];

  // Tarih validasyon
  if (dateParts[0]) {
    let d = dateParts[0].replace(/\D/g, "");
    if (d.length === 1) {
      if (d !== "0" && d > "3") d = "3";
    } else if (d.length === 2) {
      let dayNum = parseInt(d);
      if (dayNum < 1) d = "01";
      else if (dayNum > 31) d = "31";
    }
    dateParts[0] = d;
  }

  if (dateParts[1]) {
    let m = dateParts[1].replace(/\D/g, "");
    if (m.length === 1) {
      if (m !== "0" && m > "1") m = "1";
    } else if (m.length === 2) {
      let monNum = parseInt(m);
      if (monNum < 1) m = "01";
      else if (monNum > 12) m = "12";
    }
    dateParts[1] = m;
  }

  if (dateParts[2]) {
    let y = dateParts[2].replace(/\D/g, "");
    if (y.length > 4) y = y.slice(0, 4);
    dateParts[2] = y;
  }

  // Saat validasyon
  if (timeParts[0]) {
    let h = timeParts[0].replace(/\D/g, "");
    if (h.length === 1) {
      if (h !== "0" && h > "2") h = "2";
    } else if (h.length === 2) {
      let hourNum = parseInt(h);
      if (hourNum < 0) h = "00";
      else if (hourNum > 23) h = "23";
    }
    timeParts[0] = h;
  }

  if (timeParts[1]) {
    let min = timeParts[1].replace(/\D/g, "");
    if (min.length === 1) {
      if (min !== "0" && min > "5") min = "5";
    } else if (min.length === 2) {
      let minNum = parseInt(min);
      if (minNum < 0) min = "00";
      else if (minNum > 59) min = "59";
    }
    timeParts[1] = min;
  }

  if (timeParts[2]) {
    let s = timeParts[2].replace(/\D/g, "");
    if (s.length === 1) {
      if (s !== "0" && s > "5") s = "5";
    } else if (s.length === 2) {
      let secNum = parseInt(s);
      if (secNum < 0) s = "00";
      else if (secNum > 59) s = "59";
    }
    timeParts[2] = s;
  }

  // Tekrar birleştir
  let newDateVal = dateParts.filter(Boolean).join(".");
  let newTimeVal = timeParts.filter(Boolean).join(":");
  let newVal = newDateVal + (newTimeVal ? " " + newTimeVal : "");

  displayValue.value = newVal;

  // Eğer tarih ve saat tamamsa emit et, değilse boş gönder
  if (
    dateParts.length === 3 &&
    dateParts[0].length === 2 &&
    dateParts[1].length === 2 &&
    dateParts[2].length === 4 &&
    timeParts.length === 3 &&
    timeParts[0].length === 2 &&
    timeParts[1].length === 2 &&
    timeParts[2].length === 2
  ) {
    emit("update:modelValue", displayToIso(newVal));
  } else {
    emit("update:modelValue", "");
  }

  nextTick(() => {
    const input = inputRef.value;
    if (!input) return;
    let pos = input.selectionStart;
    // Cursor pozisyonunu iki nokta ve boşluklar için ayarla
    if (pos === 3 || pos === 6 || pos === 11 || pos === 14 || pos === 17) pos++;
    input.setSelectionRange(pos, pos);
  });
}
</script>
