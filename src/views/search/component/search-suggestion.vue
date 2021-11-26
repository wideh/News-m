<template>
  <div class="search-suggestion">
    <van-cell :title="str" icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
        <!-- 搜索关键字高亮 -->
        <div slot="title" v-html="highlight(str, searchText)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    // 属性名：要监视的数据名称
    // 第一次输入的值没监视到，因为此时组件还没创建
    // searchText () {
    //     console.log('hello')
    // }
    // 这才是完整写法
    searchText: {
      handler: debounce(async function () {
        // 1.找到数据接口，2.获取数据，3.模板绑定展示
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      // 组件建立后，立即被调用
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 搜索关键字高亮
    highlight (source, keyword) {
      // 参数 source: 原始字符串
      // 参数 keyword: 需要高亮的关键词
      // 返回值：替换之后的高亮字符串
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写#3296fa
      const reg = new RegExp(keyword, 'gi')
      return source.replace(reg, `<span style="color: red">${keyword}</span>`)
    }
  }
}
</script>

<style scoped lang="less"></style>
