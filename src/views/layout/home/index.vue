<template>
  <div class="home">
    <van-nav-bar class="app-nav-bar">
      <van-button class="serch-btn" slot="title" icon="search" type="info" round to="/search">搜 索</van-button>
    </van-nav-bar>
    <!-- 标签页有一个功能，只有第一次查看的时候才会渲染里面的内容 -->
    <van-tabs class='channel-tabs' v-model="active">
      <van-tab
        v-for="chanel in channels" :key="chanel.id"
        :title="chanel.name"
      >
        <!-- 文章列表 -->
        <artical-list :channel="chanel"></artical-list>
      </van-tab>
      <div slot='nav-right' class="wap-nav-placeholder"></div>
      <div slot='nav-right' @click="isChannelEditShow=true" class="wap-nav-wrap">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <van-popup v-model="isChannelEditShow" position="bottom"
      class="channal-edit"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height:100%"
    >
      <chanal-edit :user-chanals="channels" :active="active"
        @close='isChannelEditShow=false'
        @update-active="active = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticalList from './component/artical-list.vue'
import chanalEdit from './component/channal-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
// import Vue from 'vue'
export default {
  name: 'home',
  components: {
    ArticalList,
    chanalEdit
  },
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false // 控制频道编辑的显示
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 滚动条偏移量
      console.log(scrollTop)
    },
    async loadChannels () {
      // 请求用户频道列表
      // const { data } = await getUserChannels()
      // this.channels = data.data.channels
      try {
        let channels = []
        if (this.user) {
          // 已登录，请求获取线上的频道数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录
          const localChannels = getItem('user-channels')
          if (localChannels) {
            // 有本地频道数据，则使用
            channels = localChannels
          } else {
            // 没有本地频道数据，则请求获取默认推荐的频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        // 将数据更新到组件中
        this.channels = channels
        // this.$store.commit('setTitles', channels)
      } catch (err) {
        console.log(err)
        this.$toast('数据获取失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .home{
    /deep/ .van-nav-bar__title{
      max-width: none;
    }
    .serch-btn{
      width: 227px;
      height: 32px;
      background-color: #5babfb;
      border: none;
      .van-icon{
        font-size: 16px;
      }
      .van-button__text{
        font-size: 14px;
      }
    }
    .channel-tabs{
      position: sticky;
      top: 0;
      /deep/ .van-tab{
        border-right: 1px solid #edeff3;
        border-bottom: 1px solid #edeff3;
      }
      /deep/ .van-tabs__line{
        width: 15px;
        height: 3px;
        background: #3296fa;
        bottom: 20px;
      }
    }
    .wap-nav-wrap{
      position: fixed;
      width: 33px;
      height: 43px;
      right: 0;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.9;
      .van-icon{
        font-size: 24px;
      }
      &:before{
        content:'';
        width: 1px;
        height: 29px;
        background: #000;
        background-size: contain;
        position: absolute;
        left: 0;
        top: 7px;
      }
    }
    .wap-nav-placeholder{
      width:33px;
      flex-shrink:0;
    }
  }
</style>
