import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入vant ui
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入全局样式,为了用全局样式,不被vant样式覆盖，不加important,放在后边
import './style/index.less'
// 自动设置rem基准值（html标签字体大小）
import 'amfe-flexible'
// 引入dayjs第三方插件
import './utils/day.js'
import './utils/appback.js'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
