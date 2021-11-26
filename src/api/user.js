/*
*用户注册登录模块 api请求处理
*/
import request from '@/utils/request'
// 这里单独加载store,在和组件中this.$store一个东西
// import store from '@/store/'
/* 用户认证(登录注册) */
export const login = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}
/*
*获取短信验证码
*/
export const sendSms = mobile => {
  return request({
    method: 'get',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
/*
*获取用户登录的信息
*/
export const getCurrentUser = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user'
    // 用户权限设置，必须加请求头，可统一放到axios拦截器中
    // ，Authorization 特殊格式，Bearer +token
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
/*
*获取用户频道列表
*/
export const getUserChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}
/*
*获取所有频道列表
*/
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}
/* 批量增加用户频道列表，用于在线存储 */
export const addUserChannels = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data
  })
}
/* 删除指定用户频道列表，用于在线存储 */
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
/**
 * 添加关注
 */
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}
/**
 * 取消关注
 */
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

/**
 * 获取指定用户信息
 */
export function getUserById (userId) {
  return request({
    method: 'GET',
    url: `/app/v1_0/users/${userId}`
  })
}

/**
 * 关注用户
 */
export function followUser (userId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
 * 取消关注用户
 */
export function unFollowUser (userId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

/**
 * 获取用户的关注列表
 */
export function getFollowingsByUser (userId, params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/followings',
    params,
    data: {
      target: userId.toString()
    }
  })
}

/**
 * 获取用户的粉丝列表
 */
export function getFollowersByUser (userId, params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/followers',
    params,
    data: {
      target: userId.toString()
    }
  })
}

/**
 * 获取用户个人资料
 */
export function getProfile (userId) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

/**
 * 更新用户照片资料
 */
export function updateUserPhoto (formData) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    // Content-Type multipart/form-data
    // 必须传递 FormData 对象
    data: formData
  })
}

/**
 * 更新用户照片资料
 */
export function updateUserProfile (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}
