/*
*文章请求相关模块
*/
import request from '@/utils/request'

/* 获取文章列表 */
export const getArticales = params => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params
  })
}

/* 获取文章详情 */
export const getArticle = articleId => {
  return request({
    method: 'get',
    url: `/v1_0/articles/${articleId}`
  })
}
/**
 * 收藏文章
 */
export const addCollect = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}

/**
 * 取消收藏文章
 */
export const deleteCollect = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}
/**
 * 点赞
 */
export const addLike = articleId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/**
 * 取消点赞
 */
export const deleteLike = articleId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${articleId}`
  })
}

/**
 * 获取指定用户文章列表
 */
export function getArticlesByUser (userId, params) {
  return request({
    method: 'GET',
    url: `/v1_0/users/${userId}/articles`,
    params
  })
}

/**
 * 获取当前用户收藏文章列表
 */
export function getUserCollectArticles (params) {
  return request({
    method: 'GET',
    url: '/v1_0/article/collections',
    params
  })
}

/**
 * 获取当前用户阅读历史文章列表
 */
export function getUserHistoryArticles (params) {
  return request({
    method: 'GET',
    url: '/v1_0/user/histories',
    params
  })
}
