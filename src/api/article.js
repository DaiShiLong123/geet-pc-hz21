//处理文章相关的接口
import request from 'utils/request'

export const getArticles = (params) => {
  return request({
    url: '/mp/articles',
    method: 'get',
    params,
  })
}
//文章删除接口
export const delArticle = (id) => {
  return request.delete(`/mp/articles/${id}`)
}

/**
 * 添加文章
 * @param {*} data
 */
export const addArticle = (data, draft = false) => {
  return request({
    url: `/mp/articles?draft=${draft}`,
    method: 'post',
    data,
  })
}
/**
 * 获取文章详情信息
 * @param {*} id
 */
export const getArticleById = (id) => {
  return request.get(`/mp/articles/${id}`)
}
/**
 * 修改文章
 * @param {*} data
 */
export const updateArticle = (data, draft) => {
  return request({
    url: `/mp/articles/${data.id}?draft=${draft}`,
    method: 'PUT',
    data,
  })
}
