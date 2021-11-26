<template>
  <div class="chanal-edit">
    <div class="chanal-edit-wrap">
        <van-cell center :border='false'>
            <div slot="title" class="chanal-title">我的频道</div>
            <van-button
                type='danger'
                plain
                round
                size='mini'
                @click="isEdit=!isEdit"
            >{{isEdit ? '完成':'编辑'}}</van-button>
        </van-cell>
        <van-grid :gutter="10">
            <van-grid-item
              :icon="isEdit && index? 'clear' : ''"
              class="grid-item"
              :class="{active: index === active}"
              v-for="(chanal, index) in userChanals"
              :key="index"
              :text="chanal.name"
              @click="onUserChannelClick(chanal, index)"
            />
        </van-grid>
        <van-cell center :border='false'>
            <div slot="title" class="chanal-title">频道推荐</div>
        </van-cell>
        <van-grid :gutter="10">
            <van-grid-item
              class="grid-item"
              v-for="chanal in recommentChanels"
              :key="chanal.id"
              :text="chanal.name"
              @click="onAdd(chanal)"
            />
        </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannel } from '@/api/user'
import { mapState } from 'vuex'
// getItem,
import { setItem } from '@/utils/storage'
export default {
  name: 'chanalEdit',
  props: {
    userChanals: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false // 控制编辑显示设置
    }
  },
  computed: {
    ...mapState(['user']),
    recommentChanels () {
      //   所有频道 - 我的频道 = 剩下的推荐频道
      return this.allChannels.filter(channel => {
        // 找到满足条件的userChanal，有就返回true，取反
        return !this.userChanals.find(item => {
          return item.id === channel.id
        })
      })
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      // 请求用户频道列表
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd (chanal) {
      this.userChanals.push(chanal)
      /* 数据持久化 */
      // user是vuex映射的数据，含有tokenid等登录信息
      if (this.user) {
        // 登录了，线上
        await addUserChannels({
          channels: [
            { id: chanal.id, seq: this.userChanals.length }
          ]
        })
      } else {
        // 没登录，本地存储
        setItem('user-channels', this.userChanals)
      }
    },
    onUserChannelClick (chanal, index) {
      // 编辑状态，删除频道
      if (this.isEdit && index !== 0) {
        this.deleteChannels(chanal, index)
      } else {
      // 非编辑状态，跳转频道
        this.swichChannels(index)
      }
    },
    async deleteChannels (chanal, index) {
      // 如果删除的是活跃频道的之前的频道
      if (index <= this.active) {
        //   更新激活频道的索引
        this.$emit('update-active', this.active - 1)
      }
      this.userChanals.splice(index, 1)
      // 数据持久化
      // user是vuex映射的数据，含有tokenid等登录信息
      if (this.user) {
        // 登录了，线上
        await deleteUserChannel(chanal.id)
      } else {
        // 没登录，本地存储
        setItem('user-channels', this.userChanals)
      }
    },
    swichChannels (index) {
      // 切换频道
      this.$emit('update-active', index)
      // 关闭编辑层
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.chanal-edit{
    // padding-top: 54px;
    .chanal-edit-wrap{
        position: fixed;
        top: 54px;
        left: 0;
        right: 0;
        bottom: 10px;
        overflow-y: auto;
        .van-button{
            width: 60px;
            font-size: 15px;
        }
        .chanal-title{
            font-size: 16px;
            color:#333;
        }
        .grid-item{
            width: 80px;
            height: 43px;
            /deep/.van-grid-item__content{
                background-color: #f4f5f6;
                .van-grid-item__text{
                    font-size: 14px;
                    color:#222;
                    margin-top: 0;
                }
            }
            /deep/.van-grid-item__icon{
                position: absolute;
                right: -5px;
                top: -5px;
                font-size: 20px;
                color: #ccc;
                z-index: 10;
            }
        }
        .active{
            /deep/.van-grid-item__text{
                color: red !important;
            }
        }
    }
}
</style>
