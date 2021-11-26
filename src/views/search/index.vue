<template>
    <div class="search">
        <!-- 搜索栏 -->
        <!--
        Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
        -->
        <form action="/">
            <van-search
                v-model="searchText"
                show-action
                placeholder="请输入搜索关键词"
                background="#3296fa"
                @search="onSearch(searchText)"
                @cancel="$router.back()"
                @focus="isResultShow = false"
            />
        </form>
        <!-- 搜索结果 -->
        <search-result v-if="isResultShow"
          :search-text="searchText"
        />
        <!-- 联想建议 -->
        <search-suggestion v-else-if="searchText"
          :search-text="searchText"
          @search="onSearch"
        />
        <!-- 搜索历史记录 -->
        <search-history v-else
          :search-history="searchHistories"
          @search="onSearch"
          @deleteAllHistory="searchHistories=$event"
        />
  </div>
</template>

<script>
import SearchHistory from './component/search-history'
import SearchSuggestion from './component/search-suggestion'
import SearchResult from './component/search-result'
import { setItem, getItem } from '@/utils/storage'
import { getSearchHistory } from '@/api/search.js'
import { mapState } from 'vuex'
export default {
  name: 'serach',
  components: { SearchHistory, SearchSuggestion, SearchResult },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('search-histories') || []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {
    this.loadSearchHistories()
  },
  mounted () {},
  methods: {
    onSearch (search) {
      this.searchText = search
      // console.log(val)
      // 记录搜索记录
      // 数组去重
      const index = this.searchHistories.indexOf(search)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 把最新的搜索放入顶部
      this.searchHistories.unshift(search)
      // 如果已登录，历史记录存到线上，
      // 只要调用获取搜索的数据接口，后端会给我们自动存储历史记录

      // 未登录，存储到本地,用watch父子组件监视，可省略
      // setItem('search-histories', this.searchHistories)
      this.isResultShow = true
    },
    // 用户登录，在线记录和本地记录融合去重
    async loadSearchHistories () {
      // 后端只存了4条历史记录，太少，让后端返回的数据和本地记录合并到一起
      let localHistory = getItem('search-histories') || []
      if (this.user) {
        const { data } = await getSearchHistory()
        // 合并去重
        localHistory = [...new Set([...localHistory, ...data.data.keywords])]
      }
      this.searchHistories = localHistory
    }
  }
}
</script>

<style lang="less" scoped>

</style>
