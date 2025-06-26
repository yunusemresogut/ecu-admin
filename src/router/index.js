import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('../pages/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/kayitlar',
        name: 'Kayıtlar',
        component: () => import('../pages/kayitlar/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/kayitlar/yeni-olustur',
        name: 'Kayıt Oluştur',
        component: () => import('../pages/kayitlar/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/kayitlar/duzenle/:id',
        name: 'Kayıt Düzenle',
        component: () => import('../pages/kayitlar/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/bayiler',
        name: 'Bayiler',
        component: () => import('../pages/bayiler/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/bayiler/yeni-olustur',
        name: 'Bayi Oluştur',
        component: () => import('../pages/bayiler/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/bayiler/duzenle/:id',
        name: 'Bayi Düzenle',
        component: () => import('../pages/bayiler/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/arac-marka-modeli',
        name: 'Araç Marka Modeli',
        component: () => import('../pages/arac-marka-modeli/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/arac-marka-modeli/yeni-olustur',
        name: 'Araç Marka Modeli Oluştur',
        component: () => import('../pages/arac-marka-modeli/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/arac-marka-modeli/duzenle/:id',
        name: 'Araç Marka Modeli Düzenle',
        component: () => import('../pages/arac-marka-modeli/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/beyin-markalar',
        name: 'Beyin Markalar',
        component: () => import('../pages/beyin-markalar/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/beyin-markalar/yeni-olustur',
        name: 'Beyin Marka Oluştur',
        component: () => import('../pages/beyin-markalar/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/beyin-markalar/duzenle/:id',
        name: 'Beyin Marka Düzenle',
        component: () => import('../pages/beyin-markalar/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/cihaz-turu',
        name: 'Cihaz Türü',
        component: () => import('../pages/cihaz-turu/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/cihaz-turu/yeni-olustur',
        name: 'Cihaz Türü Oluştur',
        component: () => import('../pages/cihaz-turu/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/cihaz-turu/duzenle/:id',
        name: 'Cihaz Türü Düzenle',
        component: () => import('../pages/cihaz-turu/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/ozellikler',
        name: 'Özellikler',
        component: () => import('../pages/ozellikler/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/ozellikler/yeni-olustur',
        name: 'Özellik Oluştur',
        component: () => import('../pages/ozellikler/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/ozellikler/duzenle/:id',
        name: 'Özellik Düzenle',
        component: () => import('../pages/ozellikler/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/uygulama-sekli',
        name: 'Uygulama Şekli',
        component: () => import('../pages/uygulama-sekli/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/uygulama-sekli/yeni-olustur',
        name: 'Uygulama Şekli Oluştur',
        component: () => import('../pages/uygulama-sekli/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/uygulama-sekli/duzenle/:id',
        name: 'Uygulama Şekli Düzenle',
        component: () => import('../pages/uygulama-sekli/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/vites-tipi',
        name: 'Vites Tipi',
        component: () => import('../pages/vites-tipi/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/vites-tipi/yeni-olustur',
        name: 'Vites Tipi Oluştur',
        component: () => import('../pages/vites-tipi/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/vites-tipi/duzenle/:id',
        name: 'Vites Tipi Düzenle',
        component: () => import('../pages/vites-tipi/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/yakit-turu',
        name: 'Yakıt Türü',
        component: () => import('../pages/yakit-turu/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/yakit-turu/yeni-olustur',
        name: 'Yakıt Türü Oluştur',
        component: () => import('../pages/yakit-turu/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/yakit-turu/duzenle/:id',
        name: 'Yakıt Türü Düzenle',
        component: () => import('../pages/yakit-turu/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/hesap-hareketleri',
        name: 'Hesap Hareketleri',
        component: () => import('../pages/hesap-hareketleri/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/hesap-hareketleri/yeni-olustur',
        name: 'Hesap Hareketleri Oluştur',
        component: () => import('../pages/hesap-hareketleri/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/faturalar',
        name: 'Faturalar',
        component: () => import('../pages/faturalar/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/faturalar/yeni-olustur',
        name: 'Fatura Oluştur',
        component: () => import('../pages/faturalar/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/faturalar/duzenle/:id',
        name: 'Fatura Düzenle',
        component: () => import('../pages/faturalar/Update.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/ayarlar',
        name: 'Ayarlar',
        component: () => import('../pages/ayarlar/index.vue'),
        meta: { requiresAuth: true }
      },
    ]
  },
  {
    path: '/login',
    name: 'Giriş',
    component: () => import('../pages/Login.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: { layout: 'auth' }
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0, behavior: 'smooth' });
        }, 100);
      });
    }
  },
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userToken')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  document.title = (to.meta.breadcrumb || to.name) + ' - KAF'

  const authStore = useAuthStore()

  const isAuthenticated = !!authStore.token

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      if (authStore.userData) {
        next()
      } else {
        try {
          const userRes = await axios.post(`${authStore.token}/getLoggedInUserInfo`)
          authStore.userData = userRes.data.data
          localStorage.setItem('userData', JSON.stringify(authStore.userData))
          next()
        } catch (error) {
          console.error('Kullanıcı verisi alınamadı:', error)
          authStore.logout()
          next({ name: 'Login' })
        }
      }
    }
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
