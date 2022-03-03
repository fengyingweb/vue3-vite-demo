import { createRouter, createWebHashHistory } from 'vue-router'

const Home = ()=> import('../pages/Home')
const MaterialDelivery = ()=> import('../pages/materialDelivery')
const ReceiveWarehousing = ()=> import('../pages/receiveWarehousing')
const CallEmptyCar = ()=> import('../pages/callEmptyCar')
const PointToPointCall = ()=> import('../pages/pointToPointCall')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {title: '首页', keepAlive: true}
  },
  {
    path: '/materialDelivery',
    name: 'MaterialDelivery',
    component: MaterialDelivery,
    meta: {title: '呼叫1', keepAlive: false}
  },
  {
    path: '/receiveWarehousing',
    name: 'ReceiveWarehousing',
    component: ReceiveWarehousing,
    meta: {title: '呼叫2', keepAlive: false}
  },
  {
    path: '/callEmptyCar',
    name: 'CallEmptyCar',
    component: CallEmptyCar,
    meta: {title: '呼叫3', keepAlive: false}
  },
  {
    path: '/pointToPointCall',
    name: 'PointToPointCall',
    component: PointToPointCall,
    meta: {title: '呼叫4', keepAlive: false}
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
