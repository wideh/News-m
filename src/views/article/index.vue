<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <!-- :title="(title.name)+' 详情页'" -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      title="文章详情页"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <!-- <div class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div> -->
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false"
          @click="$router.push({
            name: 'user',
            params: {
              userId: article.aut_id.toString()
            }
          })"
        >
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src=article.aut_photo
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <van-button
            class="follow-btn"
            :type="article.is_followed ? 'default' : 'info'"
            color="#3296fa"
            round
            size="small"
            :loading="isFollowLoading"
            :icon="article.is_followed ? '' : 'plus'"
            @click.stop="onFollow"
          >{{ article.is_followed ? '已关注' : '关注'}}</van-button>
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="markdown-body" v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
      </div>
      <!-- /加载完成-文章详情 -->
      <!-- 评论列表 -->
      <comment-list :source="articleId"
        :list="commentLists"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      ></comment-list>
      <!-- 加载失败：404 -->
      <!-- <div class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div> -->
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <!-- <div class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div> -->
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :badge="totalCommentCount"
        color="#777"
      />
      <van-icon
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o' "
        @click="onCollect"
      />
      <van-icon
        :color="article.attitude === 1 ? 'red' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow"
      position="bottom">
      <post-comment :target="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- 评论回复 -->
    <!-- v-if="isReplyShow"有组件关闭销毁的功能，由于组件懒加载，组件关闭后数据仍然在，
    会出现点击多个评论，看到的是第一次请求的评论回复 -->
    <van-popup v-model="isReplyShow"
      position="bottom">
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @click-close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import commentReply from './components/comment-reply'
import commentList from './components/comment-list'
import postComment from './components/postcoment'
// import { mapState } from 'vuex'
/* github风格的文章样式
github搜索github-markdown后点击github-markdown.css，进入点击raw,得到如下链接打不开，按第二行规则改成第三行
https://raw.githubusercontent.com/sindresorhus/github-markdown-css/main/github-markdown.css
https://cdn.jsdelivr.net/gh/username/repo@branch/file
https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css/github-markdown.css
*/
import './github-markdown.css'
import { getArticle, addCollect, deleteCollect, addLike, deleteLike } from '@/api/artical.js'
// 图片加载即使全局引入了vant 也需单独引入
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'ArticleIndex',
  components: { commentList, postComment, commentReply },
  /* 组件中获取动态路由参数
    方式一：this.router.params.xxx
    方式二：在roter文件夹的js中设置props: true。将动态路由参数映射到组件的props中
  */
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {},
      isFollowLoading: false, // 关注按钮的loading状态
      isPostShow: false, // 控制发布评论弹出层
      commentLists: [], // 文章评论列表
      totalCommentCount: 0, // 文章总评论数
      isReplyShow: false, // 控制评论回复弹出层
      replyComment: null // 传回来的点击回复的评论对象
    }
  },
  computed: {
    // ...mapState(['chanelsTitles']),
    // title () {
    //   const res = this.chanelsTitles.filter(channel => {
    //     return channel.id === this.article.ch_id
    //   })
    //   if (!res) {
    //     return '文章'
    //   } else {
    //     return res[0]
    //   }
    // }
  },
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      const { data } = await getArticle(this.articleId)
      this.article = data.data

      this.$nextTick(() => {
        this.handerImagePreview()
      })
    },
    /* 得到所有的img标签
    输出为空，因为数据改变影响视图更新（dom数据）不是立即的
    所以如果需要在修改数据之后，马上操作该数据影响的视图dom，
    需要把代码放到$nexttick中 */
    handerImagePreview () {
      // 1获取文章内容DOM容器
      const articleContent = this.$refs['article-content']
      // 2得到所有的img标签
      const imgs = articleContent.querySelectorAll('img')
      // 3循环img列表，给img注册点击事件
      const imgPaths = []
      // console.log(imgs)
      imgs.forEach((item, index) => {
        imgPaths.push(item.src)
        item.onclick = function () {
          // 4在事件处理中调用 ImagePreview()
          ImagePreview({
            // images: [item.src]
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    // 搜藏
    async onFollow () {
      // 开启按钮的 loading 状态
      this.isFollowLoading = true
      try {
        // 如果已关注，则取消关注
        const authorId = this.article.aut_id
        if (this.article.is_followed) {
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }

        // 更新视图
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false
    },
    // 关注
    async onCollect () {
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        // 如果已收藏，则取消收藏
        if (this.article.is_collected) {
          await deleteCollect(this.articleId)
          // this.article.is_collected = false
          // this.$toast.success('取消收藏')
        } else {
          // 添加收藏
          await addCollect(this.articleId)
          // this.article.is_collected = true
          // this.$toast.success('收藏成功')
        }
        this.article.is_collected = !this.article.is_collected
        this.$toast.success(`${this.article.is_collected ? '已' : '取消'}收藏`)
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    // 点赞
    async onLike () {
      // 两个作用：1、交互提示 2、防止网络慢用户连续不断的点击按钮请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        // 如果已经点赞，则取消点赞
        if (this.article.attitude === 1) {
          await deleteLike(this.articleId)
          this.article.attitude = -1
          this.$toast.success('取消点赞')
        } else {
          // 否则添加点赞
          await addLike(this.articleId)
          this.article.attitude = 1
          this.$toast.success('点赞成功')
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    onPostSuccess (comment) {
      // 把最新的评论数据对象放到评论列表顶部
      // 评论列表在不在父组件，此时可以在父组件新建立数组，
      // 在传给子组件，子组件初始值为传过去的数组
      this.commentLists.unshift(comment)

      // 更新评论总数量
      this.totalCommentCount++
      // 关闭评论
      this.isPostShow = false
    },
    onReplyClick (comment) {
      // console.log(comment)
      this.replyComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 20px;
      padding: 14px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 16px;
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 9px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 12px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 11px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }
    ul{
      list-style: unset;
    }
    .markdown-body {
      padding: 14px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 100px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 100px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 62px;
      color: #b4b4b4;
    }
    .text {
      font-size: 15px;
      color: #666666;
      margin: 17px 0 23px;
    }
    .retry-btn {
      width: 140px;
      height: 35px;
      line-height: 35px;
      border: 1px solid #c3c3c3;
      font-size: 15px;
      color: #666666;
    }
  }

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
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 11px;
        background-color: #e22829;
      }
    }
  }
}
.app-nav-bar{
  /deep/ .van-nav-bar__title{
    color: #fff;
    font-weight: bold;
  }
}
</style>
