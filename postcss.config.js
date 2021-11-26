/*是 PostCSS 的配置文件
*是一款 PostCSS 插件，用于将 px 单位转化为 rem 单位
配置文件也运行在node.js中
*/
// 配置文件需要导出一个对象
module.exports = {
    plugins: {
      // 自动添加浏览器厂商前缀插件，用来兼容不同的浏览器
      // 'autoprefixer': {
      //   // 用来配置要系统和浏览器兼容版本，写在这里的话会引起编译器警告警告意思就是说你应该将 
      //   //browsers 选项写到 package.json 或 .browserlistrc 文件中   
      //   browsers: ['Android >= 4.0', 'iOS >= 8']
      // },
      'postcss-pxtorem': {
        // 设计稿是基于iphone 678设计的
        // vant组件库是基于逻辑像素375px，设计稿是基于物理像素750px
        rootValue: 37.5,
        // 需要转换的css属性，*表示所有css属性
        propList: ['*']
      }
    }
  }