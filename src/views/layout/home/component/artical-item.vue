<template>
    <!-- 导航到文章详情页，后端返回每个文章都带有 art_id -->
    <van-cell class="artical-item"
        :to="{
            name: 'article',
            params: {
                articleId: artical.art_id
            }
        }"
    >
        <!-- van-multi-ellipsis--l3vant style行内样式最多显示三行 -->
        <div slot='title' class="title van-multi-ellipsis--l3">{{ artical.title }}</div>
        <div slot='label'>
            <div class="cover-wrap" v-if="artical.cover.type===3">
                <div class="cover-wrap-item"
                    v-for="(img, index) in artical.cover.images"
                    :key='index+img'
                >
                    <van-image
                        class="cover-image"
                        fit='cover'
                        :src="img"
                    />
                </div>
            </div>
            <div class="label-wrap">
                <span>{{ artical.aut_name }}</span>
                <span>{{ artical.comm_count }}评论</span>
                <span>{{ artical.pubdate | relativeTime }}</span>
            </div>
        </div>
        <van-image
            v-if="artical.cover.type==1"
            class='right'
            fit='cover'
            :src="artical.cover.images[0]"
        />
    </van-cell>
</template>

<script>
export default {
  name: 'ArticalItem',
  props: {
    artical: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
  }
}
</script>

<style lang="less" scoped>
.artical-item{
    .title{
        font-size: 16px;
        color: #3a3a3a;
    }
    /deep/.van-cell__value{
        flex:unset;
        width: 116px;
        height: 73px;
        margin-left: 12px;
    }
    .right{
        width: 116px;
        height: 73px;
    }
    .cover-wrap {
        padding: 15px 0;
        display: flex;
        .cover-wrap-item {
            flex: 1;
            height: 73px;
            &:not(:last-child) {
                padding-right: 4px;
            }
            .cover-image {
                width: 100%;
                height: 73px;
            }
        }
    }
    .label-wrap{
        font-size: 11px;
        color: #b4b4b4;
        span{
            margin-right: 12px;
        }
    }
}
</style>
