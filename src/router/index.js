// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // INICIO
  {
    path: '/',
    component: () => import('@/components/home.vue'),
    meta: { title: 'Sea Shepherd - Home'}
  },

  // INFO GENERAL (DATOS)
  {
    path: '/datos/',
    component: () => import('@/components/datos.vue'),
    meta: { title: 'Sea Shepherd - Dades'}
  },

  // CAMARA
  {
    path: '/camara/',
    component: () => import('@/components/camara.vue'),
    meta: { title: 'Sea Shepherd - Càmera'}
  },

  // UBI DEL ROBOT
  {
    path: '/ubicacion/',
    component: () => import('@/components/ubicacion.vue'),
    meta: { title: 'Sea Shepherd - Ubicació'}

  },

  // INFORMES (GRAFICOS Y MAS)
  {
    path: '/informes/',
    component: () => import('@/components/informes.vue'),
    meta: { title: 'Sea Shepherd - Informes'}

  },
  {
    path: '/appbar/',
    component: () => import('@/components/appbar.vue'),
  },

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Default Title';
  next();
});

export default router
