<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
        <div class="bg-indigo-500 rounded-full p-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" lucide lucide-cloud-alert-icon lucide-cloud-alert"><path d="M12 12v4"/><path d="M12 20h.01"/><path d="M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708"/></svg>
        </div>
        <h1 class="text-6xl font-bold text-gray-800 mt-5">404</h1>
        <p class="text-xl text-gray-600 mt-3">Sayfa bulunamadı.</p>
        <p class="text-gray-500 mt-2">
            Burada bir şey yok gibi gözüküyor. Belki yanlış bir yola sapmışsınızdır.
        </p>
        <button
            class="p-4 rounded-2xl mt-5 bg-indigo-500 text-white hover:bg-indigo-600"
            @click="goHome">Ana sayfaya dön</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push('/');
};
</script>