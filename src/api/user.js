import request from 'utils/request'

/**
 * 登录请求，用于用户登录
 * @param {*} mobile
 * @param {*} code
 */
export const login = (mobile, code) => {
  return request({
    method: 'post',
    url: '/authorizations',
    data: { mobile, code },
  })
}
