import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY), // 当前用户的登录状态 (服务器返回的token等数据)
    // title: getItem('title'),
    // chanelsTitles: getItem('titles'),
    cachePages: ['layoutIndex']
  },
  getters: {
    getTitle (state) {
      return state.title
    }
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中,
      // 这里仅仅是为了持久化数据
      setItem(USER_KEY, JSON.stringify(state.user))
    },
    // 在\home\component\artical-list.vue里触发
    // setTitle (state, data) {
    //   state.title = data
    //   setItem('title', JSON.stringify(state.title))
    // },
    // setTitles (state, data) {
    //   state.chanelsTitles = data
    //   setItem('titles', JSON.stringify(state.chanelsTitles))
    // },
    // 添加缓存页面
    addCachePage (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    // 移除缓存页面
    removeCachePage (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
