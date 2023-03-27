/**
 * 专门用来处理 token 的 js 工具函数集
 */

// token 的 key
const TOKEN_KEY = 'geek_pc_token_21'

// 1 将 token 保存到本地缓存中
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

// 2 移除 token
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

// 3 读取 token
export const getToken = () => localStorage.getItem(TOKEN_KEY)

// 4 判断是否登录，假设，本地缓存中有 token 就是登录了
// !! 表示转化为布尔值，因为，我们要的是 是否登录，就是一个布尔值类型，所以，需要将其转化为 布尔值类型
export const hasToken = () => !!getToken()

/* export { setToken, removeToken, getToken, isAuth } */
