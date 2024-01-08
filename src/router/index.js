// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // INICIO
  {
    path: '/',
    component: () => import('@/components/home.vue'),
  },

  // INFO GENERAL (DATOS)
  {
    path: '/datos/',
    component: () => import('@/components/datos.vue'),
  },

  // CAMARA
  {
    path: '/camara/',
    component: () => import('@/components/camara.vue'),
  },

  // UBI DEL ROBOT
  {
    path: '/ubicacion/',
    component: () => import('@/components/ubicacion.vue'),
  },

  // INFORMES (GRAFICOS Y MAS)
  {
    path: '/informes/',
    component: () => import('@/components/informes.vue'),
  },
  {
    path: '/appbar/',
    component: () => import('@/components/appbar.vue'),
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
