/*
*初始化 dayjs 相关配置
*/
import vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用中文语言包
dayjs.locale('zh-cn') // 全局使用

// 配置使用处理相对时间
dayjs.extend(relativeTime)

dayjs().to(dayjs('2008-01-01')) // 31 年前
// 例如日期格式化
// console.log(dayjs().format('YYYY-MM-DD'))

// 把处理相对时间的代码包装为全局过滤器，然后就可以在任何组件中使用
// 所谓的过滤器就是一个可以在模板中调用的函数
// 在组件的模板中使用过滤器：{{ xxx | relativeTime}}
// 管道符前面的内容会作为参数传递给过滤器函数
// 过滤器的返回值会渲染到使用过滤器的模板中
vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
vue.filter('datetime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})
