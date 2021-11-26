<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <!-- prop 数据如果是引用类型，可以修改
        注意这个修改指的是：user.name='jack'、arr.push()、arr.splice
        但是任何的prop数据都不能重新赋值：xxx==xxx
        如果要让数据=xxx,让父组件自己修改-->
        <!-- <span @click="$emit('deleteAllHistory', [])">全部删除</span> -->
        <span @click="deleteAllHistory">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon
        v-else
        name="delete"
        @click="isDeleteShow = true"
      />
    </van-cell>
    <van-cell
      v-for="(history, index) in searchHistory"
      :key="'history'+index"
      :title="history"
      @click="onDelete(history, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
import { deleteArticales } from '@/api/search.js'
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onDelete (history, index) {
      // 删除状态
      if (this.isDeleteShow) {
        return this.searchHistory.splice(index, 1)
        // 数据持久化处理，在父组件中的watch监视实现
      }
      // 非删除状态，点击跳转
      this.$emit('search', history)
    },
    deleteAllHistory () {
      deleteArticales()
      // 不用直接删除
      // this.searchHistory.splice(0)
      this.$emit('deleteAllHistory', [])
    }
  }
}
</script>

<style scoped lang="less"></style>
