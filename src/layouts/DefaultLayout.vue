<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'transition-all duration-300 ease-in-out bg-white shadow-md h-full z-20',
        sidebarOpen ? 'w-64' : 'w-0 overflow-hidden',
      ]"
      class="shrink-0"
    >
      <div class="h-16 flex items-center justify-center border-b border-gray-200">
        <span class="text-xl font-bold">LOGO</span>
      </div>
      <nav class="p-4 space-y-2 text-sm">
        <RouterLink to="/" class="block py-2 px-3 rounded hover:bg-gray-100" :class="{ 'bg-gray-200 font-semibold': route.path === '/' }">Ana Sayfa</RouterLink>
        <RouterLink to="/bayiler" class="block py-2 px-3 rounded hover:bg-gray-100" :class="{ 'bg-gray-200 font-semibold': route.path === '/bayiler' }">Bayiler</RouterLink>
        <RouterLink to="/kayitlar" class="block py-2 px-3 rounded hover:bg-gray-100" :class="{ 'bg-gray-200 font-semibold': route.path === '/kayitlar' }">Kayıtlar</RouterLink>

        <!-- Açılır Menü -->
        <div v-for="menu in dropdownMenus" :key="menu.id">
          <button
            @click="toggleDropdown(menu.id)"
            class="w-full text-left py-2 px-3 rounded hover:bg-gray-100 flex justify-between items-center"
          >
            {{ menu.label }}

            <svg
              v-if="openDropdownId === menu.id"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-up-icon lucide-chevron-up"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-down-icon lucide-chevron-down"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <transition name="fade">
            <div v-if="openDropdownId === menu.id" class="pl-4 space-y-1">
              <RouterLink
                v-for="item in menu.items"
                :key="item.path"
                :to="item.path"
                class="block py-1 px-2 hover:bg-gray-100 rounded"
                :class="{ 'bg-gray-200 font-semibold': route.path === item.path }"
              >
                {{ item.label }}
              </RouterLink>
            </div>
          </transition>
        </div>

        <RouterLink to="/ayarlar" class="block py-2 px-3 rounded hover:bg-gray-100" :class="{ 'bg-gray-200 font-semibold': route.path === '/ayarlar' }">Ayarlar</RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 h-full max-w-full overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-white shadow z-10 px-4 flex items-center justify-between w-full">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="text-gray-700 me-3"
          :title="!sidebarOpen ? 'Menü Aç' : 'Menü Kapat'"
        >
          <svg
            v-if="!sidebarOpen"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-panel-left-open-icon lucide-panel-left-open"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
            <path d="m14 9 3 3-3 3" />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-panel-right-open-icon lucide-panel-right-open"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M15 3v18" />
            <path d="m10 15-3-3 3-3" />
          </svg>
        </button>
        <div>
          <button @click="logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-log-out-icon lucide-log-out"
            >
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden p-4 card">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute, useRouter } from "vue-router";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const sidebarOpen = ref(true);
const openDropdownId = ref(null);

const toggleDropdown = (id) => {
  openDropdownId.value = openDropdownId.value === id ? null : id;
};

const dropdownMenus = [
  {
    id: "sistem",
    label: "Sistem",
    items: [
      { label: "Araç Marka Modeli", path: "/arac-marka-modeli" },
      { label: "Beyin Markalar", path: "/beyin-markalar" },
      { label: "Cihaz Turu", path: "/cihaz-turu" },
      { label: "Özellikler", path: "/ozellikler" },
      { label: "Uygulama Şekli", path: "/uygulama-sekli" },
      { label: "Vites Tipi", path: "/vites-tipi" },
      { label: "Yakıt Turu", path: "/yakit-turu" },
    ],
  },
  {
    id: "mali-islemler",
    label: "Mali İşlemler",
    items: [
      { label: "Faturalar", path: "/faturalar" },
      { label: "Hesap Hareketleri", path: "/hesap-hareketleri" },
    ],
  },
];

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
