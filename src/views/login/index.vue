<template>
  <div class="login-container">
    <!-- nav-bar 页面头部，每个页都有，样式在全局样式里设置-->
    <van-nav-bar
      title="注册 / 登录"
      left-arrow
      class="app-nav-bar"
      @click-left="$router.back()"
    />
    <!-- 表单 show-error清除默认提示格式-->
    <van-form @submit="onLogin"
      :show-error="false"
      :show-error-message="false"
      validate-first
      @failed="onFailed"
      ref="login-form"
    >
      <van-field
        v-model="user.mobile"
        clearable
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
      >
      <!-- prevent阻止点击按钮后，去执行默认的表单提交事件 -->
        <template #button>
          <van-count-down
           v-if="isCountDownShow" :time="1000 * 60" format="ss s"
           @finish="isCountDownShow = false"
          />
          <van-button v-else
            class="send-btn"
            size="small"
            round
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
            >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-bth-wrap">
        <van-button class="login-btn" type="info" block>登 录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'login',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1\d{10}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码输入位数错误' }
        ]
      },
      // 控制发送验证码倒计时
      isCountDownShow: false,
      // 发送验证码的loading状态，防止用户点击后，看没反应多次点击
      isSendSmsLoading: false
    }
  },
  methods: {
    async onLogin () {
      Toast.loading({
        message: '登录中...',
        forbidClick: true,
        /* 展示时长(ms)，值为 0 时，toast 不会消失 */
        duration: 0
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const { data } = await login(this.user)
        // 4.处理响应结果
        // console.log(res)
        // 就算vant已经全局引入，还需单独引入，
        // 或者用$toast就不用单独引入了
        Toast.success('登录成功')
        // 登陆成功，将后端返回的用户登录状态token放到vuex容器中
        this.$store.commit('setUser', data.data)

        // 用了keep-alive后,layout组件首次需重新加载
        // 登录后清除 layout 的缓存，让他重新渲染,然后在layout首页加载完后，添加上
        this.$store.commit('removeCachePage', 'layoutIndex')

        // 登录成功回到原界面,先用这种方式，但是不太好
        // this.$router.back()
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败，手机号或验证码失败')
      }
    },
    onFailed (err) {
      if (err.errors[0]) {
        this.$toast({
          message: err.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendSms () {
      // validate 验证表单，支持传入 name 来验证单个或部分表单项
      try {
        // 1.验证手机号是否通过
        // try花括号里，直接加catch 可以单独处理错误，但在此处不行，就不能处理其他错误了
        await this.$refs['login-form'].validate('mobile')
        // 展示按钮的loading状态，防止网络慢，用户多次点击触发发送
        this.isSendSmsLoading = true
        // 2.验证通过，请求发送验证码
        const res = await sendSms(this.user.mobile)
        console.log(res)

        // 3.短信发出去了，显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        let message = ''
        // try 里面任何错误都会进入 catch
        // 不同的错误需要用不同的提示，那就需要判断了
        // 短信发送失败的错误提示
        if (err && err.response && err.response.status === 429) {
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        console.dir(err)

        // 提示用户
        this.$toast({
          message,
          position: 'top'
        })
      }
      // 无论是发送失败还是成功，关闭loading
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  .send-btn{
    width: 76px;
    height: 23px;
    background-color: #ededed;
    padding: 0;
    .van-button__text{
      font-size: 11px;
      color: #666;
    }
  }
  .login-bth-wrap{
    padding:26px 16px;
    .login-btn{
      background-color: #6db4fb;
      border:none;
      .van-button__text{
        font-size:15PX;
      }
    }
  }
}
</style>
