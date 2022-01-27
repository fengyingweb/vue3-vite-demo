import { createRouter, createWebHashHistory } from 'vue-router'

const Home = ()=> import('../pages/Home.vue')
const About = ()=> import('../pages/About.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {title: '首页', keepAlive: true}
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {title: '关于', keepAlive: false}
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
