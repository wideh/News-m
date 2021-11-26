<template>
  <div class="user-follow">
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      @click-left="$router.push('/me')"
    >
      <van-tabs
        v-model="active"
        slot="title"
        background="#3296fa"
        color="#fff"
        title-inactive-color="#fff"
        title-active-color="#fff"
        :border="false"
      >
        <van-tab title="关注" :to="`/user/${userId}/follow`" replace class="tab-item">
          <follow-list/>
        </van-tab>
        <van-tab title="粉丝" :to="`/user/${userId}/follow?tab=followers`" replace class="tab-item">
          <follow-list :followers=true />
        </van-tab>
      </van-tabs>
    </van-nav-bar>
  </div>
</template>

<script>
import FollowList from './components/follow-list'

export default {
  name: 'UserFollow',
  components: {
    FollowList
  },
  props: {
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    active: {
      get () {
        return this.$route.query.tab === 'followers' ? 1 : 0
      },
      set (val) {
        // console.log(val)
      }
    }
  },
  watch: {
    // $route () {
    //   this.$route.query.tab === 'followers' ? this.active = 1 : this.active = 0
    // }
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
.tab-item{
  width: 130px;
}
/deep/ .van-tabs__line{
  bottom: 20px;
  right: 0;
}
</style>
