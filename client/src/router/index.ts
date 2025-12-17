import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/records',
      name: 'records',
      component: () => import('@/views/MedicalRecords.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('@/views/EmergencyAccess.vue')
    },
    {
      path: '/emergency/:nftId',
      name: 'emergency-view',
      component: () => import('@/views/EmergencyView.vue')
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('user')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
