import Vue from 'vue'
import VueRouter from 'vue-router'
import NotesPage from '../views/NotesPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },

  {
    path: '/register',
    name: 'Registration',
    redirect: '/login'
  },

  {
    path: '/',
    name: 'Home',
    component: NotesPage
  },

  {
    path: '/note/create',
    name: 'NoteCreation',
    component: () => import('../views/NoteEditingPage.vue')
  },

  {
    path: '/note/edit',
    name: 'NoteEditing',
    component: () => import('../views/NoteEditingPage.vue')
  },

  {
    path: '/search',
    name: 'Search',
    component: NotesPage
  }
]

const router = new VueRouter({
  routes
})

export default router
