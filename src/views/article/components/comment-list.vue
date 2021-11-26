<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-cell :title="title"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item v-for="(comment, index) in list" :key="'c'+(index)"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      ></comment-item>
    </van-list>
    <!-- 评论列表 -->
  </div>
</template>

<script>
import commentItem from './coment-item'
import { getComments } from '@/api/comment.js'
export default {
  name: 'ArticleComment',
  components: { commentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      default: 'a'
    },
    title: {
      type: String,
      default: '全部评论'
    },
    list: {
      type: Array,
      // 对象类型的默认值必须通过函数返回
      // default: function () {
      //   return []
      // }
      default: () => []
    }
  },
  data () {
    return {
      // list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 评论偏移，相当于第几页即页码
      limit: 10
    }
  },

  methods: {
    async onLoad () {
      // 评论不能正常加载，this.source.toString()数据为超大数时，为数组，将数组转为字符串
      // console.log(this.source.toString())
      const { data } = await getComments({
        type: this.type,
        source: this.source.toString(), // 源id，文章id或评论id
        offset: this.offset,
        limit: this.limit
      })
      // console.log(data)
      this.$emit('update-total-count', data.data.total_count)
      const { results } = data.data
      this.list.push(...results)
      this.loading = false
      if (results.length) {
        this.offset = data.data.last_id // 更新获取下一页数据的页码
      } else {
        this.finished = true // 没有数据了，关闭加载更多
      }
    }
  }
}
</script>

<style scoped lang="less">
  .publish-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .van-list {
    margin-bottom: 45px;
  }
</style>
