<template>
    <div class="layout-container">
        <!-- 子路由出口 -->
        <!-- 二级动态组件缓存 -->
        <keep-alive>
          <router-view />
        </keep-alive>
        <!-- 底部导航栏 -->
        <van-tabbar v-model="active" route>
            <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
            <van-tabbar-item icon="search" to="/qa">问答</van-tabbar-item>
            <van-tabbar-item icon="friends-o" to="/video">视频</van-tabbar-item>
            <van-tabbar-item icon="setting-o" to="/me">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
  name: 'layoutIndex',
  data () {
    return {
      active: 0
    }
  },
  mounted () {
    this.$store.commit('addCachePage', 'layoutIndex')
  }
}
</script>
<style lang="less" scoped>
/deep/.van-tabbar-item--active{
  .van-tabbar-item__icon{
    animation: scaledong .3s;
  }
}
@keyframes scaledong {
  0%{
    transform:scale(1)
  }
  50%{
    transform:scale(1.5)
  }
  100%{
    transform:scale(1)
  }
}
</style>
