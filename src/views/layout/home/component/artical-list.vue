<template>
  <div class="artical-list" ref="articel-list">
    <van-pull-refresh v-model="isPullDown" @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration='1500'
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <artical-item v-for="(item, index) in articals" :key="index"
          :artical='item'
        ></artical-item>
        <!-- <van-cell v-for="(item, index) in articals" :key="index" :title="item.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticales } from '@/api/artical.js'
import ArticalItem from './artical-item.vue'
import { debounce } from 'lodash'
export default {
  name: 'ArticalList',
  components: {
    ArticalItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articals: [],
      loading: false,
      finished: false,
      timestamp: null, // 时间戳，请求的分页
      isPullDown: false, // 下拉刷新
      refreshSuccessText: '', // 下拉刷新成功提示
      scrollTop: 0
    }
  },
  mounted () {
    const articellist = this.$refs['articel-list']
    articellist.onscroll = debounce(() => {
      this.scrollTop = articellist.scrollTop
    }, 50)
  },
  // keep-alive的生命周期，created，只执行一次，在组件第一次创建时
  activated () {
    // 缓存中被激活
    // 把滚动距离设置回原位
    this.$refs['articel-list'].scrollTop = this.scrollTop
  },
  // deactivated () {
  //   // 组件失去活动了
  // },
  methods: {
    async onLoad () {
    // 异步更新数据
      // 1.请求获取数据
      const { data } = await getArticales({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(), /* 时间戳。相当于页码，请求最新数据使用当前时间戳，下一页数据
        使用上一次返回的数据中的时间戳 */
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // console.log(data)
      // 2.把数据放到数组中
      const { results } = data.data
      this.articals.push(...results)
      // 3.本次加载状态结束
      this.loading = false

      // 4.数据全部加载完成
      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据，加载完毕
        this.finished = true
      }
      // this.$store.commit('setTitle', this.channel)
    },
    async onRefresh () {
      // 下拉刷新，组件自己就会展示 loading 状态
      // 1.请求数据
      const { data } = await getArticales({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 2.数据放到顶部追加
      const { results } = data.data
      this.articals.unshift(...results)
      // 3.关闭刷新状态
      this.isPullDown = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style lang="less" scoped>
.artical-list{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    top: 90px;
    overflow-y:auto;
}
</style>
