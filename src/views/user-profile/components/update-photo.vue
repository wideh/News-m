<template>
  <div class="update-photo">
    <img :src="image" alt="" ref="img" class="image">
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    fileObj: {
    //   type: Object,
      required: true
    }
  },
  data () {
    return {
      image: URL.createObjectURL(this.fileObj),
      cropper: null // 裁切器实例
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 查看模式
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 截图比例
      autoCropArea: 1, // 自动区域
      cropBoxMovable: false, // 不允许截图区域移动
      cropBoxResizable: false, // 不允许截图区域缩放
      modal: true, // 显示阴影区域
      // movable: false
      background: false, // 关闭背景
      movable: true, // 允许移动
      ...this.cropperOptions
    })
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },
    async onConfirm () {
      // 请求更新
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      try {
        const file = await this.getCroppedCanvas()
        const fd = new FormData()
        fd.append('photo', file)
        // 如果要求 Content-Type 是 multipart/form-data，
        // 则一定要提交 formData 数据对象，专门用于文件上传的，不能提交 {} 没用
        // 构造包含文件的表单数据对象
        // 表单数据，需要穿文件对象，所以父组件传文件后，再用URL.createObjectURL转为blob对象
        // const fd = new FormData()
        // fd.append('photo', this.fileObj)
        // 请求更新
        const { data } = await updateUserPhoto(fd)
        // console.log(data.data.photo)
        this.$toast.success('保存成功')
        // 更新视图
        // this.$emit('update-photo', window.URL.createObjectURL(file))
        this.$emit('update-photo', data.data.photo)
        this.$emit('close')
      } catch (err) {
        this.$toast.fail('保存失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
// @import "~cropperjs/dist/cropper.css";
.update-photo{
  .toolbar{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
    /deep/ .van-nav-bar__content{
      justify-content: space-between;
      padding: 16px;
      .van-nav-bar__text{
        color: #fff;
        font-size: 16px;
      }
    }
  }
  .image{
    display: block;
    max-width: 100%;
  }
  /deep/ .cropper-container{
    // position: absolute;
    top: 50vh;
    transform: translateY(-50%);
  }
}
</style>
