import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/'),
    meta: { requiresAuth: false } // 添加额外的自定义数据。requiresAuth是否需要登录才能访问
  },
  {
    path: '/',
    component: () => import('../views/layout/'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('../views/layout/home/'),
        meta: { requiresAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('../views/layout/qa/'),
        meta: { requiresAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('../views/layout/video/'),
        meta: { requiresAuth: false }
      },
      {
        path: '/me',
        name: 'me',
        component: () => import('../views/layout/me/'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/'),
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('../views/article/'),
    // 将动态路由参数映射到组件的props中
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
    meta: { requiresAuth: true }
  },
  { // 小智同学
    name: 'user-chat',
    path: '/user/chat'
    // component: () => import('@/views/user-chat'),
    // meta: { requiresAuth: true }
  },
  { // 用户关注/粉丝
    path: '/user/:userId/follow',
    component: () => import('@/views/user-follow'),
    props: true,
    meta: { requiresAuth: true }
  },
  { // 用户主页
    name: 'user',
    path: '/user/:userId',
    component: () => import('@/views/user'),
    props: true,
    meta: { requiresAuth: true }
  },
  { // 我的作品、收藏、历史
    name: 'my-article',
    path: '/my-article/:type?',
    component: () => import('@/views/my-article'),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.state.user) {
      return next()
    }
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗？'
    }).then(() => {
      // 确认
      router.replace({
        name: 'login',
        query: {
          redirect: from.fullPath
        }
      })
    }).catch(() => {
      // 取消了，中断路由导航
      next(false)
    })
  } else {
    next()
  }
})

export default router
