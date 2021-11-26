<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('click-close')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
    <comment-item
        :comment="comment"
      ></comment-item>
    <!-- /当前评论项 -->

    <!-- 评论的回复列表 -->
    <comment-list :source="comment.com_id"
        title='所有回复'
        type="c"
        :list="commentList"
      ></comment-list>
    <!-- /评论的回复列表 -->

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
    </div>
    <!-- /底部区域 -->
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow"
      position="bottom">
      <post-comment :target="comment.com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import commentItem from './coment-item'
import commentList from './comment-list'
import postComment from './postcoment'
export default {
  name: 'CommentReply',
  components: { commentItem, commentList, postComment },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: [] // 回复评论列表
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onPostSuccess (comment) {
      // 回复平复放到顶部
      this.commentList.unshift(comment)
      // 更新回复评论数量
      this.comment.reply_count++
      // 关闭评论回复弹出层
      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
.article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 200px;
      height: 30px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
  }
</style>
