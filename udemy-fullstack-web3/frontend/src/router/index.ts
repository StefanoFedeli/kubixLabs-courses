// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from "@/store/app";

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        beforeEnter: (to, from, next) => {
          const appStore = useAppStore();
          if (appStore.isLoggedIn) {
            next({name: 'Dashboard'});
          } else {
            next();
          }
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
        beforeEnter: (to, from, next) => {
          const appStore = useAppStore();
          if (appStore.isLoggedIn) {
            next({name: 'Dashboard'});
          } else {
            next();
          }
        }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        beforeEnter: (to, from, next) => {
          const appStore = useAppStore();
          if (appStore.isLoggedIn) {
            next();
          } else {
            next({name: 'Login'});
          }
        }
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
