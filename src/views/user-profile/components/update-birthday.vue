<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="date"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      confirm-button-text="完成"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: ['birthday'],
  data () {
    return {
      date: new Date(this.birthday),
      minDate: new Date('1900-1-1'),
      // minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      isShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      // 请求更新
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })

      const birthday = dayjs(this.date).format('YYYY-MM-DD')
      await updateUserProfile({
        birthday: birthday
      })
      this.$toast.success('保存成功')
      // this.$emit('input', this.defaultIndex)
      this.$emit('update:birthday', birthday)
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less"></style>
