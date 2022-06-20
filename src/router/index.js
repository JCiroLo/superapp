import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/analyticis',
    name: 'Analytics',
    component: () => import('../views/Analytics/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index.vue'),
    meta: {
      hideForAuth: true
    }
  },
  {
    path: '/project/:projectName',
    name: 'Project',
    component: () => import('../views/Project/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/requests',
    name: 'Peticiones',
    component: () => import('../views/Requests/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  ,
  {
    path: '/users',
    name: 'Usuarios',
    component: () => import('../views/Users/index.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = store.getters.isAuthenticated

  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    return next({ name: 'Login' })
  }

  if (to.matched.some(record => record.meta.hideForAuth) && user) {
    return next({ name: 'Home' })
  }
  return next()
})

export default router
