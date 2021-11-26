<template>
  <div class="update-name">
    <van-nav-bar
      title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    >
    </van-nav-bar>
    <div class="intro-field-wrap">
      <!-- van-field的 v-model 双向绑定，不能修改props,需把props赋给data-->
      <van-field
        v-model="inputName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      inputName: this.value
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // async saveProfile (field, value) {
    //   this.$toast.loading({
    //     duration: 0, // 持续时间，0表示持续展示不停止
    //     forbidClick: true, // 是否禁止背景点击
    //     message: '保存中...' // 提示消息
    //   })

    //   try {
    //     await updateUserProfile({
    //       [field]: value
    //     })
    //     this.$toast.success('保存成功')
    //     this.user[field] = value
    //     globalBus.$emit('user-update')
    //     this.isEditGenerShow = false
    //   } catch (err) {
    //     this.$toast.success('保存失败')
    //     return Promise.reject(err)
    //   }
    // },
    async onConfirm () {
      // 请求更新
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      try {
        await updateUserProfile({
          name: this.inputName
        })
        this.$toast.success('保存成功')
        this.$emit('input', this.inputName)
        this.$emit('close')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.intro-field-wrap{
  padding: 10px;
}
</style>
