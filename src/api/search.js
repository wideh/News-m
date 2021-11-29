/*
*搜索请求相关模块
*/
import request from '@/utils/request'

/* 获取联想建议 */
export const getSearchSuggestions = q => {
  return request({
    method: 'get',
    url: '/v1_0/suggestion',
    params: {
      q // 建议关键词
    }
  })
}
/* 获取搜索结果 */
export const getSearchResult = params => {
  return request({
    method: 'get',
    url: '/v1_0/search',
    params
  })
}
/* 获取搜索历史 */
export const getSearchHistory = () => {
  return request({
    method: 'get',
    url: '/v1_0/search/histories'
  })
}
/* 删除搜索历史 */
export const deleteArticales = () => {
  return request({
    method: 'DELETE',
    url: '/v1_0/search/histories'
  })
}
