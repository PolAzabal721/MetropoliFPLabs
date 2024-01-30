// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // INICIO
  {
    path: '/',
    component: () => import('@/components/home.vue'),
    meta: { title: 'Sea Shepherd - Home' }
  },

  // INFO GENERAL (DATOS)
  {
    path: '/datos/',
    component: () => import('@/components/datos.vue'),
    meta: { title: 'Sea Shepherd - Dades' }
  },

  // CAMARA
  {
    path: '/camara/',
    component: () => import('@/components/camara.vue'),
    meta: { title: 'Sea Shepherd - Càmera' }
  },

  // UBI DEL ROBOT
  {
    path: '/ubicacion/',
    component: () => import('@/components/ubicacion.vue'),
    meta: { title: 'Sea Shepherd - Ubicació' }

  },

  // INFORMES (GRAFICOS Y MAS)
  {
    path: '/informes/',
    component: () => import('@/components/informes.vue'),
    meta: { title: 'Sea Shepherd - Informes' }

  }, 

    // CREAR AREAS (COMO LA RUMBA)
    {
    path: '/creaArea/',
    component: () => import('@/components/creaArea.vue'),
    meta: { title: 'Sea Shepherd - Crear areas' }

  },

  // EDITAR AREAS 
  {
    path: '/editarArea/',
    component: () => import('@/components/editarArea.vue'),
    meta: { title: 'Sea Shepherd - Editar areas' }

  },

  // EMPAREJAR AREA CON SUBMARINO
  {
    path: '/asignarSubmarino/',
    component: () => import('@/components/asignarSubmarino.vue'),
    meta: { title: 'Sea Shepherd - Emparejar areas' }

  },

     // CREAR LOGIN
     {
      path: '/login/',
      component: () => import('@/components/login.vue'),
      meta: { title: 'Sea Shepherd - Login'}
  
    },

  // APPABAR DE TODO EL COD
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
