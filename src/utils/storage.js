/*
*本地存储模块封装
*/
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // 放到try中，是因为data可能不是json格式字符串
  try {
  // 尝试把 data 转为 js对象
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const setItem = (name, value) => {
  // 如果是对象，转为json格式字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}
