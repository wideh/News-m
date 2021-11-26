<template>
  <div>
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.replace('/me')"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="onShowFile" center>
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="user.photo"
        />
      </van-cell>
      <!-- accept="image/*" 设置只接受图片 -->
      <input
        type="file"
        hidden
        ref="file"
        accept="image/*"
        @change="onFileChange"
      >
      <van-cell
        title="昵称"
        :value="user.name"
        is-link
        @click="isEditNameShow = true"
      />
      <van-cell
        title="性别"
        :value="user.gender === 0 ? '男' : '女'"
        is-link
        @click="isEditGenerShow = true"
      />
      <van-cell
        title="生日"
        :value="user.birthday"
        is-link
        @click="isEditBirthdayShow = true"
      />
    </van-cell-group>

    <!-- 修改昵称 -->
    <van-popup
      style="height: 100%;"
      class="intro-popup"
      v-model="isEditNameShow"
      position="bottom"
      get-container="body"
      @opened="$refs.name.focus()"
    >
      <!-- <van-nav-bar
        title="昵称"
        left-text="取消"
        right-text="完成"
        @click-left="isEditNameShow = false"
        @click-right="onNameConfirm"
      >
      </van-nav-bar>
      <div class="intro-field-wrap">
        <van-field
          v-model="inputName"
          rows="2"
          autosize
          type="textarea"
          maxlength="7"
          placeholder="请输入昵称"
          show-word-limit
          ref="name"
          id="name"
        />
      </div> -->

      <!-- 当传递给子组件的数据既要使用又要修改，例如这里的name，
      这种情况下我们可以使用v-modle简写 ，默认监听input事件，传value给子组件的props
      v-model只能使用一次
      -->
      <!-- :gender.sync可以多重复用，作用和v-model一致
          :gender.sync="user.gender" sync翻译过来为同步
           :gender="user.gender"
           @update:gender="user.gender = $event"
      -->
      <update-name @close="isEditNameShow = false"
        v-model="user.name"
        v-if="isEditNameShow"
      />

    </van-popup>
    <!-- /修改昵称 -->

    <!-- 修改性别 -->
    <van-popup
      v-model="isEditGenerShow"
      position="bottom"
      get-container="body"
    >
      <!-- <van-picker
        show-toolbar
        title="性别"
        :columns="columns"
        @cancel="isEditGenerShow = false"
        :default-index="user.gender"
        @change="onPickerChange"
        @confirm="saveProfile('gender', selectedGender)"
      /> -->

      <update-gender @close="isEditGenerShow = false"
        v-model="user.gender"
        v-if="isEditGenerShow"
      />
    </van-popup>
    <!-- /修改性别 -->

    <!-- 修改生日 -->
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
    >
      <!-- <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        confirm-button-text="完成"
        @confirm="onBirthdayConfirm"
        @cancel="isEditBirthdayShow = false"
      /> -->
      <update-birthday
        @close="isEditBirthdayShow = false"
        :birthday.sync="user.birthday"
        v-if="isEditBirthdayShow"
      />
    </van-popup>
    <!-- /修改生日 -->

    <!-- 修改头像：上传头像预览裁切 -->
    <!-- github 搜索cropperjs -->
    <van-popup
      class="update-photo-popup"
      v-model="isPreviewPhotoShow"
      style="height: 100%; background-color: #000"
      position="bottom"
    >
      <update-photo
        v-if="isPreviewPhotoShow"
        :file-obj="previewImage"
        @close="isPreviewPhotoShow = false"
        @update-photo="user.photo = $event"
      />
      <!-- <img-cropper
        v-if="isPreviewPhotoShow"
        :src="previewImage"
        ref="img-cropper"
      />
      <div class="crop-bottom">
        <span @click="isPreviewPhotoShow = false">取消</span>
        <span @click="onPhotoConfirm">完成</span>
      </div> -->
    </van-popup>
    <!-- /修改头像：上传头像预览裁切 -->
  </div>
</template>

<script>
import UpdateName from './components/update-name'
import updateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
import {
  getProfile,
  updateUserProfile,
  updateUserPhoto
} from '@/api/user'
import dayjs from 'dayjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'UserProfile',
  components: {
    UpdateName, updateGender, UpdateBirthday, UpdatePhoto
  },
  data () {
    return {
      user: {
      },
      isEditNameShow: false,
      isNameShow: false,
      // inputName: '',
      isEditGenerShow: false,
      // actions: [
      //   { name: '男', value: 0 },
      //   { name: '女', value: 1 }
      // ],
      isEditBirthdayShow: false,
      // currentDate: new Date(),
      // minDate: new Date(1970, 0, 1),
      isPreviewPhotoShow: false,
      previewImages: [],
      previewImage: ''
      // columns: ['男', '女'],
      // selectedGender: 0
    }
  },
  computed: {
    // 获取隐藏的input DOM元素
    file () {
      return this.$refs.file
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getProfile()
      this.user = data.data
      this.currentDate = new Date(this.user.birthday)
      this.inputName = this.user.name
    },

    // 点击input type为file类型，开始传入本机文件
    onShowFile () {
      this.file.click()
    },
    onFileChange () {
      // 在弹出层预览图片
      // window.URL.createObjectURL， 得到input传入的文件
      // const fileObj = URL.createObjectURL(this.file.files[0])
      const fileObj = this.file.files[0]
      // 清空数组
      this.previewImages = []
      // 添加预览图片
      this.previewImages.push(fileObj)
      this.previewImage = fileObj
      // 显示预览
      this.isPreviewPhotoShow = true

      this.file.value = ''
    },
    /* 后面的函数用了组件后就可以不要了 */
    async saveProfile (field, value) {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })

      try {
        await updateUserProfile({
          [field]: value
        })
        this.$toast.success('保存成功')
        this.user[field] = value
        globalBus.$emit('user-update')
        this.isEditGenerShow = false
      } catch (err) {
        this.$toast.success('保存失败')
        return Promise.reject(err)
      }
    },
    /* 修改昵称 */
    async onNameConfirm () {
      try {
        // 请求更新
        await this.saveProfile('name', this.inputName)

        // 更新视图
        this.user.name = this.inputName

        // 关闭弹层
        this.isEditNameShow = false
      } catch ({ response }) {
        if (response.status === 400) {
          this.$toast.fail('昵称必须在1-7个字符之间')
        } else if (response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    },
    /* 修改性别 */
    onPickerChange (picker, value, index) {
      this.selectedGender = index
    },
    async onGenerSelect (item) {
      // 请求更新
      await this.saveProfile('gender', item.value)

      // 更新视图
      this.user.gender = item.value

      // 关闭弹层
      this.isEditGenerShow = false
    },
    /* 修改生日 */
    async onBirthdayConfirm (value) {
      const birthday = dayjs(value).format('YYYY-MM-DD')

      // 请求更新
      await this.saveProfile('birthday', birthday)

      // 更新视图
      this.user.birthday = birthday

      // 关闭弹层
      this.isEditBirthdayShow = false
    },

    // async onUpdatePhoto () {
    //   this.$toast.loading({
    //     duration: 0, // 持续时间，0表示持续展示不停止
    //     forbidClick: true, // 是否禁止背景点击
    //     message: '保存中...' // 提示消息
    //   })

    //   try {
    //     // 构造包含文件的表单数据对象
    //     const fd = new FormData()
    //     const fileObj = this.file.files[0]
    //     fd.append('photo', fileObj)

    //     // 请求更新
    //     await updateUserPhoto(fd)

    //     // 更新视图
    //     this.user.photo = URL.createObjectURL(fileObj)

    //     // 关闭图片预览
    //     this.isPreviewPhotoShow = false

    //     this.$toast.success('保存成功')

    //     globalBus.$emit('user-update')
    //   } catch (err) {
    //     this.$toast.success('保存失败')
    //   }
    // },

    async onPhotoConfirm () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })

      try {
        // 构造包含文件的表单数据对象
        const fd = new FormData()
        const blob = await this.$refs['img-cropper'].getCroppedBlob()
        console.log(blob)
        // const fileObj = this.file.files[0]
        fd.append('photo', blob)

        // 请求更新
        await updateUserPhoto(fd)

        // 更新视图
        this.user.photo = URL.createObjectURL(blob)

        // 关闭图片预览
        this.isPreviewPhotoShow = false

        this.$toast.success('保存成功')

        globalBus.$emit('user-update')
      } catch (err) {
        this.$toast.success('保存失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.intro-popup {
  background-color: #f5f7f9;
  .intro-field-wrap {
    padding: 10px;
  }
}

.avatar {
  width: 30px;
  height: 30px;
}

/deep/ .van-image-preview__cover {
  left: 0;
  bottom: 0;
  right: 0;
  top: unset;
  .van-nav-bar {
    background: #000;
  }
}

.crop-bottom {
  position: fixed;
  bottom: 0;
  height: 44px;
  font-size: 16px;
  color: #fff;
  /* background: #000; */
  /* background-color: rgba(0, 0, 0, .6); */
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
.update-photo-popup{
  background-color: #000;
}
</style>
