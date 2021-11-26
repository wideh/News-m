<template>
  <div class="update-gender">
    <!-- @change="onPickerChange" 知道van-picker的子组件改变后的值 ,即可知道选的是男还是女-->
    <van-picker
        show-toolbar
        title="性别"
        :columns="columns"
        @cancel="$emit('close')"
        :default-index="defaultIndex"
        @change="onPickerChange"
        @confirm="onConfirm"
      />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      defaultIndex: this.value,
      columns: ['男', '女']
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onPickerChange (picker, value, index) {
      this.defaultIndex = index
    },
    async onConfirm () {
      // 请求更新
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      await updateUserProfile({
        gender: this.defaultIndex
      })
      this.$toast.success('保存成功')
      this.$emit('input', this.defaultIndex)
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.intro-field-wrap{
  padding: 10px;
}
</style>
