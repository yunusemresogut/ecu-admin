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
      <div
        class="h-16 flex items-center justify-center border-b border-gray-200"
      >
        <img src="/ecusavelogo.png" alt="Logo" class="h-10" />
      </div>
      <nav class="p-4 space-y-2 text-sm">
        <RouterLink
          to="/"
          class="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-semibold': route.path === '/' }"
        >
          <House class="w-4 h-4 text-gray-500" />Ana Sayfa
        </RouterLink>
        <RouterLink
          to="/kullanicilar"
          class="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2"
          :class="{
            'bg-gray-200 font-semibold': route.path === '/kullanicilar',
          }"
        >
          <UsersRound class="w-4 h-4 text-gray-500" />Kullanıcılar
        </RouterLink>
        <RouterLink
          to="/kayitlar"
          class="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-semibold': route.path === '/kayitlar' }"
        >
          <Archive class="w-4 h-4 text-gray-500" />Kayıtlar
        </RouterLink>

        <!-- Açılır Menü -->
        <div v-for="menu in dropdownMenus" :key="menu.id">
          <button
            @click="toggleDropdown(menu.id)"
            class="w-full text-left py-2 px-3 rounded hover:bg-gray-100 flex justify-between items-center"
          >
            <div class="flex items-center gap-2">
              <component :is="menu.icon" class="w-4 h-4" />
              <!-- 🔹 ikon -->
              {{ menu.label }}
            </div>
            <ChevronUp v-if="openDropdownId === menu.id" class="w-4 h-4" />
            <ChevronDown v-else class="w-4 h-4" />
          </button>

          <transition name="fade">
            <div v-if="openDropdownId === menu.id" class="pl-4 space-y-1">
              <RouterLink
                v-for="item in menu.items"
                :key="item.path"
                :to="item.path"
                class="py-1 px-2 hover:bg-gray-100 rounded flex items-center gap-2"
                :class="{
                  'bg-gray-200 font-semibold': route.path === item.path,
                }"
              >
                <component :is="item.icon" class="w-4 h-4 text-gray-500" />
                {{ item.label }}
              </RouterLink>
            </div>
          </transition>
        </div>
        
        <RouterLink
          to="/kullanici-hedefleri"
          class="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-semibold': route.path === '/kullanici-hedefleri' }"
        >
          <User class="w-4 h-4 text-gray-500" />Kullanıcı Hedefleri
        </RouterLink>
        <RouterLink
          to="/destek"
          class="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-semibold': route.path === '/destek' }"
        >
          <MessageCircleMore class="w-4 h-4 text-gray-500" />Destek
        </RouterLink>
        <RouterLink
          to="/iletisim"
          class="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-semibold': route.path === '/iletisim' }"
        >
          <MailOpen class="w-4 h-4 text-gray-500" />İletişim
        </RouterLink>
        <!-- <RouterLink
          to="/performans-modulleri"
          class="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-semibold': route.path === '/ayarlar' }"
        >
          <Cog class="w-4 h-4 text-gray-500" />Performans Modülleri
        </RouterLink> -->
        <RouterLink
          to="/ayarlar"
          class="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-semibold': route.path === '/ayarlar' }"
        >
          <Cog class="w-4 h-4 text-gray-500" />Ayarlar
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 h-full max-w-full overflow-hidden">
      <!-- Header -->
      <header
        class="h-16 bg-white shadow z-10 px-4 flex items-center justify-between w-full"
      >
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="text-gray-700 me-3"
          :title="!sidebarOpen ? 'Menü Aç' : 'Menü Kapat'"
        >
        <PanelLeftOpen v-if="!sidebarOpen" />
        <PanelRightOpen v-else />
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
    icon: "Settings",
    items: [
      { label: "Araç Marka Modeli", path: "/arac-marka-modeli", icon: "Car" },
      { label: "Beyin Markalar", path: "/beyin-markalar", icon: "Cpu" },
      { label: "Cihaz Turu", path: "/cihaz-turu", icon: "Tablet" },
      {
        label: "Uygulama Şekli",
        path: "/uygulama-sekli",
        icon: "ClipboardList",
      },
      { label: "Vites Tipi", path: "/vites-tipi", icon: "Settings2" },
      { label: "Yakıt Turu", path: "/yakit-turu", icon: "Fuel" },
    ],
  },
  {
    id: "ozellikler",
    label: "Özellikler",
    icon: "ListChecks",
    items: [
      { label: "Özellik", path: "/ozellikler", icon: "CheckSquare" },
      { label: "Gruplar", path: "/gruplar", icon: "Layers" },
      { label: "Fiyat Aralıkları", path: "/fiyat-araliklari", icon: "DollarSign" },
    ],
  },
  {
    id: "mali-islemler",
    label: "Mali İşlemler",
    icon: "CreditCard",
    items: [
      { label: "Faturalar", path: "/faturalar", icon: "FileText" },
      {
        label: "Hesap Hareketleri",
        path: "/hesap-hareketleri",
        icon: "DollarSign",
      },
    ],
  },
  
];

// {
//     id: "site-ayarlari",
//     label: "Site Ayarları",
//     icon: "Cog",
//     items: [
//       { label: "Blog", path: "/blog", icon: "FileText" },
//     ],
//   },

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
