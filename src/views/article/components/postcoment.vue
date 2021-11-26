<template>
  <div class="post-comment">
    <!-- v-model.trim 去除输入前后空格后给message -->
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <!-- :disabled="!message" 为空时，按钮隐藏 -->
    <van-button
      type="primary"
      size="small"
      @click="onPost"
      :disabled="!message"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'PostComment',
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data () {
    return {
      message: '' // 评论内容
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中',
        forbidClick: true
      })
      const { data } = await addComment({
        target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.message, // 评论内容
        art_id: this.articleId ? this.articleId.toString() : null
      })
      // console.log(data)
      this.$emit('post-success', data.data.new_obj)
      this.$toast.success('发布成功')
      // 发布成功，清空文本框内容
      this.message = ''
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  padding: 15px;
  justify-content: center;
  align-items: flex-end;
  .post-field {
    width: 295px;
    background: #f5f7f9;
    margin-right: 7px;
  }
}
</style>
