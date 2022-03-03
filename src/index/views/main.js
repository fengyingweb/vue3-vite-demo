import 'lib-flexible'
import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/base.less'
import '@/assets/css/vue2-animate.css'
import router from './router'
import store from './store'
import { Dialog, Toast, Popup, Icon, Field, Button, Picker, CellGroup, NavBar, Collapse, CollapseItem } from 'vant'
import {displayConvertTo, displayStyleControl, numberFix} from '@/utils/directive'

const app = createApp(App)

router.beforeEach((to, from, next)=> {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})

store.dispatch('initApp')

// 注册指令
displayConvertTo(app)
displayStyleControl(app)
numberFix(app)

import './mock'

app.use(Dialog).use(Toast).use(Popup).use(Icon).use(Field)
  .use(Button).use(Picker).use(CellGroup).use(NavBar).use(Collapse)
  .use(CollapseItem)
app.use(router).use(store).mount('#app')
