<template>
  <div id="app">
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
// import { removeItem } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
  // beforeDestroy () {
  //   removeItem('titles')
  // }
}
</script>
<style lang="less">
// #app{
//   height: calc(100vh + 46px);
// }
</style>
