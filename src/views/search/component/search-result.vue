<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(artical, index) in searchList" :key="index" :title="artical.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      searchList: [],
      loading: false,
      finished: false,
      page: 1, // 页码
      perPage: 10 // 每页大小
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getSearchResult({
        page: this.page,
        per_page: this.perPage,
        q: this.searchText
      })
      // console.log(data)
      // 2.把数据放到数组中
      const { results } = data.data
      this.searchList.push(...results)
      // 3.本次加载状态结束
      this.loading = false

      // 4.数据全部加载完成
      if (results.length) {
        this.page++
      } else {
        // 没有数据，加载完毕
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-result{
    position: fixed;
    top: 54px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
}
</style>
