import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/RegistrationForm.vue')
  },

  {
    path: '/registration',
    name: 'Registration',
    redirect: '/login'
  },

  {
    path: '/',
    name: 'Home',
    component: HomePage
  },

  {
    path: '/note/create',
    name: 'NoteCreation',
    component: () => import('../views/NoteCreationForm.vue')
  },

  {
    path: '/note/edit',
    name: 'NoteEditing',
    component: () => import('../views/NoteCreationForm.vue')
  },

  {
    path: '/search',
    name: 'Search',
    component: HomePage
  }
]

const router = new VueRouter({
  routes
})

export default router
