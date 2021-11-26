<template>
  <div class="me">
    <van-cell-group v-if='user' class="my-info">
      <div class="base-info-wrap">
        <div class="avatar-title-wrap" @click="$router.push({
              name: 'user',
              params: {
                userId: currentUser.id
              }
          })"
        >
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="currentUser.photo"
          />
          <div class="title">{{ currentUser.name }}</div>
        </div>
        <van-button
          round
          size="mini"
          @click="$router.push('/user/profile')"
        >编辑资料</van-button>
      </div>
      <van-grid :border='false' class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="span">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item" :to="`/user/${currentUser.id}/follow`" >
          <div slot="text">
            <div class="span">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item" :to="`/user/${currentUser.id}/follow?tab=followers`">
          <div slot="text">
            <div class="span">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="span">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div v-else class="not-login" @click="$router.push({
        name: 'login',
        query: {
          redirect: '/me'
        }
      })"
    >
      <div>
        <img class="mobile" src="./unlogin.png">
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid :column-num="2" class="nav-grid mb-4">
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="shoucang" text="收藏"
        to="/my-article/collect"
      />
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="lishi" text="历史"
        to="/my-article/history"
      />
    </van-grid>
    <!-- <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="/user/chat" /> -->
    <van-cell class="logoout" v-if="user"
      @click="onlogout"
      title="退出登录" to=""
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'
export default {
  name: 'me',
  props: {},
  data () {
    return {
      currentUser: {}
    }
  },
  computed: {
    // 把vue的state映射过来
    ...mapState(['user'])
  },
  created () {
    this.loaderCurrentUser()
  },
  methods: {
    async loaderCurrentUser () {
      // 用户存在则去请求当前用户数据，自己补充
      if (this.user) {
        const { data } = await getCurrentUser()
        this.currentUser = data.data
      }
    },
    onlogout () {
      // 提示用户确认退出
      // 确认处理退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => {
          // 清除用户登录状态
          this.$store.commit('setUser', null)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.me {
  .my-info{
    background: url("./banner.png") no-repeat;
    height: 182px;
    box-sizing: border-box;
    background-size: cover;
    padding: 40px 20px;
    font-size: 15px;
    color: #fff;
    .base-info-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .avatar-title-wrap {
        display: flex;
        align-items: center;
        .avatar {
          margin-right: 15px;
          width: 66px;
          height: 66px;
          padding: 2px;
          background: #fff;
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color:unset;
    }
    .data-info{
      .data-info-item{
        height: 65px;
        color: #fff;
        text-align: center;
        .span{
          font-size: 18px;
        }
        .text{
          font-size: 11px;
        }
      }
    }
  }
  /* 父组件的style作用域只能修改子组件的根元素，
  要作用到子组件里的其他子元素，需使用/deep/(建议用)或“<<<”使其作用到更深的作用域 */
  /deep/.nav-grid{
    .nav-grid-item{
      height: 70px;
      .toutiao{
        font-size: 22px;
      }
      .toutiao-shoucang{
        color: #eb5253;
      }
      .toutiao-lishi{
        color: #ff9d1d;
      }
      .van-grid-item__text{
        font-size: 14px;
        color:#333333;
      }
    }
  }
  .logoout{
    text-align: center;
    color: #d86262;
  }
  .mb-4{
    margin-bottom: 4px;
  }
  .not-login{
    height: 180px;
    background: url('./banner.png') no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile{
      width: 66px;
      height: 66px;
    }
    .text{
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
