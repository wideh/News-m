/* 请求模块 */
import axios from 'axios'
// 这里单独加载store,在和组件中this.$store一个东西
import store from '@/store/'
import jsonBig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router/'
// 重新请求token 定义新的请求，不用request请求，以免混淆，响应出现错误后出现死循环
const refreshTokenReq = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net', // 接口基础路径

  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]

})
/* 请求拦截器 */
request.interceptors.request.use(function (config) {
  // config:本次请求发送的相关信息
  // console.log(config)
  const { user } = store.state
  // 如果用户已登录，统一给接口设置token 信息
  if (user) {
    // 请求信息增加头部消息
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后一定要返回，否则请求会停在这里
  return config
}, function (error) {
  return Promise.reject(error)
})

/* 响应拦截器 */
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  // console.dir(error)
  const status = error.response.status
  if (status === 400) {
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token 过期
    // 如果没有 user 或 user.token，直接登录
    const { user } = store.state
    if (!user || !user.token) {
      return redirectLogin()
    }
    // 如果有 refresh_token, 则请求获取新的 token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 拿到新的token 更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)
      // 把失败的请求重新发出去, err.config是本次请求的相关配置信息对象
      // 它的请求是request ，拦截器中通过store 容器访问 token 数据
      return request(error.config)
    } catch (error) {
      // 刷新token 都失败了，直接跳转登录页
      redirectLogin()
    }
  } else if (status === 403) {
    Toast.fail('没用权限操作')
  } else if (status >= 500) {
    Toast.fail('服务端异常，请稍后重试')
  }
  // 抛出异常
  return Promise.reject(error)
})

function redirectLogin () {
  router.replace({
    name: 'login',
    // 传递的查询参数，查询参数会以 ？ 作为分隔符 放到url后面
    query: {
      // 名字自己取的 。router.currentRouter和this.$router一样
      redirect: router.currentRouter.fullPath
    }
  })
}
export default request
