import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../views/Landing.vue';
import Login from '../views/Login.vue';
import Registro from '../views/Registro.vue';
import DashboardDonante from '../views/DashboardDonante.vue';
import DashboardOng from '../views/DashboardOng.vue';
import RecuperarPassword from '../views/RecuperarPassword.vue';
import RestablecerPassword from '../views/RestablecerPassword.vue';
import DashboardAdmin from '../views/DashboardAdmin.vue';
import CambiarPasswordObligatorio from '../views/CambiarPasswordObligatorio.vue';


const routes = [
   { path: '/', component: Landing },
   { path: '/login', component: Login, meta: { requiresGuest: true } },
   { path: '/registro', component: Registro, meta: { requiresGuest: true } },
   { path: '/recuperar-password', component: RecuperarPassword, meta: { requiresGuest: true } },
   { path: '/restablecer-password', component: RestablecerPassword, meta: { requiresGuest: true } },
  
   // Rutas protegidas por rol
   { path: '/donante', component: DashboardDonante, meta: { requiresAuth: true, role: 'DONANTE' } },
   { path: '/ong', component: DashboardOng, meta: { requiresAuth: true, role: 'ONG' } },
   { path: '/admin', component: DashboardAdmin, meta: { requiresAuth: true, role: 'ADMIN' } },
  
   { path: '/cambiar-password-obligatorio', component: CambiarPasswordObligatorio, meta: { requiresAuth: true } }
];


const router = createRouter({
   history: createWebHistory(),
   routes,
});


router.beforeEach((to, from, next) => {
   const token = localStorage.getItem('token');
   const usuarioString = localStorage.getItem('usuario');
   let usuario = null;


   if (usuarioString && usuarioString !== 'undefined') {
       try {
           usuario = JSON.parse(usuarioString);
       } catch (e) {
           console.error("Error parseando usuario de localStorage", e);
       }
   }


   const isAuthenticated = !!token && token !== 'undefined' && !!usuario;


   if (to.meta.requiresAuth && !isAuthenticated) {
       return next('/login');
   }


   if (to.meta.requiresGuest && isAuthenticated) {
       // Redirigir a su dashboard correspondiente
       if (usuario.rol === 'ADMIN') return next('/admin');
       if (usuario.rol === 'ONG') return next('/ong');
       if (usuario.rol === 'DONANTE') return next('/donante');
       return next('/');
   }


   if (to.meta.role && usuario && usuario.rol !== to.meta.role) {
       // Redirigir a su dashboard correspondiente
       if (usuario.rol === 'ADMIN') return next('/admin');
       if (usuario.rol === 'ONG') return next('/ong');
       if (usuario.rol === 'DONANTE') return next('/donante');
       return next('/');
   }


   if (to.path !== '/cambiar-password-obligatorio' && isAuthenticated && usuario.debeCambiarPassword) {
       return next('/cambiar-password-obligatorio');
   }


   next();
});


export default router;