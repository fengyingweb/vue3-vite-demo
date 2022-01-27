import 'lib-flexible'
import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/base.less'
import '@/assets/css/vue2-animate.css'
import router from './router'
import store from './store'

const app = createApp(App)

router.beforeEach((to, from, next)=> {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})

app.use(router).use(store).mount('#app')
